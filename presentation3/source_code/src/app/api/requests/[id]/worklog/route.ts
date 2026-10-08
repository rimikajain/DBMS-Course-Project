import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id, 10);
    const body = await req.json();
    const { hoursSpent, description, materialId, quantityUsed, laborHourlyRate = 150 } = body;

    const hours = parseFloat(hoursSpent);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      return NextResponse.json(
        { success: false, error: "Hours spent must be between 0.1 and 24.0 hours." },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Work log description/diagnosis is mandatory for closure." },
        { status: 400 }
      );
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        assignments: {
          where: { status: { in: ["Assigned", "In Progress"] } },
          orderBy: { assignedDate: "desc" },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    const activeAssignment = request.assignments[0];
    if (!activeAssignment) {
      return NextResponse.json(
        { success: false, error: "No active assignment found for this request." },
        { status: 400 }
      );
    }

    // ACID Transaction Execution
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create WorkLog
      const workLog = await tx.workLog.create({
        data: {
          assignmentId: activeAssignment.id,
          hoursSpent: hours,
          description: description.trim(),
        },
      });

      let totalMaterialCost = 0;

      // 2. Process Spare Parts Inventory
      if (materialId && quantityUsed && parseInt(quantityUsed, 10) > 0) {
        const matId = parseInt(materialId, 10);
        const qty = parseInt(quantityUsed, 10);

        const material = await tx.material.findUnique({
          where: { id: matId },
        });

        if (!material) {
          throw new Error("Specified material not found in inventory.");
        }

        if (material.quantityInStock < qty) {
          throw new Error(
            `Insufficient stock for '${material.materialName}'. Available: ${material.quantityInStock}, Requested: ${qty}.`
          );
        }

        // Deduct inventory
        await tx.material.update({
          where: { id: matId },
          data: {
            quantityInStock: material.quantityInStock - qty,
          },
        });

        // Insert RequestMaterial bridge
        await tx.requestMaterial.create({
          data: {
            logId: workLog.id,
            materialId: matId,
            quantityUsed: qty,
          },
        });

        totalMaterialCost = qty * material.unitCost;

        // Record material cost in ledger
        await tx.cost.create({
          data: {
            requestId,
            costType: "Material",
            amount: totalMaterialCost,
          },
        });
      }

      // 3. Record Labor Cost
      const laborCost = hours * laborHourlyRate;
      await tx.cost.create({
        data: {
          requestId,
          costType: "Labor",
          amount: laborCost,
        },
      });

      // 4. Update Assignment and Request Status to Completed
      await tx.assignment.update({
        where: { id: activeAssignment.id },
        data: { status: "Completed" },
      });

      const updatedRequest = await tx.request.update({
        where: { id: requestId },
        data: {
          currentStatus: "Completed",
          dateCompleted: new Date(),
        },
      });

      // 5. Audit Trail
      await tx.statusHistory.create({
        data: {
          requestId,
          previousStatus: request.currentStatus,
          newStatus: "Completed",
          remarks: `Job completed by technician. Logged ${hours} hrs. Labor: ₹${laborCost}, Materials: ₹${totalMaterialCost}.`,
        },
      });

      return { updatedRequest, workLog, totalMaterialCost, laborCost };
    });

    return NextResponse.json({
      success: true,
      message: "Work log submitted and request closed successfully.",
      data: result,
    });
  } catch (error: any) {
    console.error("Error logging work:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to log work." },
      { status: 500 }
    );
  }
}
