import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id, 10);
    const body = await req.json();
    const { techId } = body;

    if (!techId) {
      return NextResponse.json(
        { success: false, error: "Technician ID is required." },
        { status: 400 }
      );
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { assignments: true },
    });

    if (!request) {
      return NextResponse.json(
        { success: false, error: "Request not found." },
        { status: 404 }
      );
    }

    if (request.currentStatus !== "Open" && request.currentStatus !== "Assigned") {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot assign technician. Request is currently '${request.currentStatus}'.`,
        },
        { status: 400 }
      );
    }

    // Capacity Control: Check active assignments for this technician
    const activeTasks = await prisma.assignment.count({
      where: {
        techId: parseInt(techId, 10),
        status: { in: ["Assigned", "In Progress"] },
      },
    });

    if (activeTasks >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Technician capacity exceeded! Technician already has 3 active tasks.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Assignment
      const assignment = await tx.assignment.create({
        data: {
          requestId,
          techId: parseInt(techId, 10),
          status: "Assigned",
        },
        include: {
          technician: { include: { user: true } },
        },
      });

      // 2. Update Request Status
      await tx.request.update({
        where: { id: requestId },
        data: { currentStatus: "Assigned" },
      });

      // 3. Status History
      await tx.statusHistory.create({
        data: {
          requestId,
          previousStatus: request.currentStatus,
          newStatus: "Assigned",
          remarks: `Assigned to technician ${assignment.technician.user.fullName} (${assignment.technician.specialization}).`,
        },
      });

      return assignment;
    });

    return NextResponse.json({
      success: true,
      message: "Technician successfully assigned.",
      data: result,
    });
  } catch (error: any) {
    console.error("Error assigning technician:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to assign technician." },
      { status: 500 }
    );
  }
}
