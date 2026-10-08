import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid request ID." },
        { status: 400 }
      );
    }

    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        user: true,
        room: { include: { building: true } },
        asset: { include: { category: true } },
        priority: true,
        assignments: {
          include: {
            technician: { include: { user: true } },
            workLogs: {
              include: {
                requestMaterials: { include: { material: true } },
              },
            },
          },
          orderBy: { assignedDate: "desc" },
        },
        statusHistory: { orderBy: { changedDate: "desc" } },
        costs: true,
        feedback: true,
      },
    });

    if (!request) {
      return NextResponse.json(
        { success: false, error: "Request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch request." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid request ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { description, currentStatus, priorityId, roomId, assetId, userId } = body;

    const existing = await prisma.request.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Request not found." },
        { status: 404 }
      );
    }

    const statusChanged = currentStatus && currentStatus !== existing.currentStatus;

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = {};
      if (description !== undefined) updateData.description = description.trim();
      if (currentStatus !== undefined) updateData.currentStatus = currentStatus;
      if (priorityId !== undefined) updateData.priorityId = parseInt(priorityId, 10);
      if (roomId !== undefined) updateData.roomId = parseInt(roomId, 10);
      if (assetId !== undefined) {
        updateData.assetId = assetId ? parseInt(assetId, 10) : null;
      }
      if (userId !== undefined) updateData.userId = parseInt(userId, 10);

      if (currentStatus === "Completed" && !existing.dateCompleted) {
        updateData.dateCompleted = new Date();
      } else if (currentStatus && currentStatus !== "Completed") {
        updateData.dateCompleted = null;
      }

      const res = await tx.request.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          room: { include: { building: true } },
          asset: true,
          priority: true,
        },
      });

      if (statusChanged) {
        await tx.statusHistory.create({
          data: {
            requestId: id,
            previousStatus: existing.currentStatus,
            newStatus: currentStatus,
            remarks: body.remarks || "Updated via management console",
          },
        });
      }

      return res;
    });

    return NextResponse.json({
      success: true,
      message: "Request successfully updated in database.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update request." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid request ID." },
        { status: 400 }
      );
    }

    const existing = await prisma.request.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            workLogs: {
              include: {
                requestMaterials: true,
              },
            },
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Request not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete associated costs
      await tx.cost.deleteMany({ where: { requestId: id } });

      // 2. Delete feedback if exists
      await tx.feedback.deleteMany({ where: { requestId: id } });

      // 3. Delete status history
      await tx.statusHistory.deleteMany({ where: { requestId: id } });

      // 4. Delete request materials and work logs
      for (const asg of existing.assignments) {
        for (const wl of asg.workLogs) {
          await tx.requestMaterial.deleteMany({ where: { logId: wl.id } });
        }
        await tx.workLog.deleteMany({ where: { assignmentId: asg.id } });
      }

      // 5. Delete assignments
      await tx.assignment.deleteMany({ where: { requestId: id } });

      // 6. Delete the request itself
      await tx.request.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: `Request #${existing.requestCode} and all related records deleted from database.`,
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete request." },
      { status: 500 }
    );
  }
}
