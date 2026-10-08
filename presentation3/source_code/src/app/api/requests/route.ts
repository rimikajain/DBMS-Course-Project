import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const buildingId = searchParams.get("buildingId");
    const priorityId = searchParams.get("priorityId");

    const where: any = {};

    if (status && status !== "ALL") {
      where.currentStatus = status;
    }

    if (buildingId) {
      where.room = { buildingId: parseInt(buildingId, 10) };
    }

    if (priorityId) {
      where.priorityId = parseInt(priorityId, 10);
    }

    if (search) {
      where.OR = [
        { requestCode: { contains: search } },
        { description: { contains: search } },
        { user: { fullName: { contains: search } } },
        { room: { roomNumber: { contains: search } } },
        { room: { building: { buildingName: { contains: search } } } },
      ];
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        user: true,
        room: {
          include: { building: true },
        },
        asset: {
          include: { category: true },
        },
        priority: true,
        assignments: {
          include: {
            technician: {
              include: { user: true },
            },
            workLogs: {
              include: {
                requestMaterials: {
                  include: { material: true },
                },
              },
            },
          },
          orderBy: { assignedDate: "desc" },
        },
        statusHistory: {
          orderBy: { changedDate: "desc" },
        },
        costs: true,
        feedback: true,
      },
      orderBy: { dateSubmitted: "desc" },
    });

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, roomId, assetId, priorityId, description } = body;

    if (!userId || !roomId || !priorityId || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Required fields missing." },
        { status: 400 }
      );
    }

    // Auto-generate unique sequential tracking code: REQ-YYYY-XXXX
    const currentYear = new Date().getFullYear();
    const count = await prisma.request.count();
    const requestCode = `REQ-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const newRequest = await prisma.$transaction(async (tx) => {
      const created = await tx.request.create({
        data: {
          requestCode,
          userId: parseInt(userId, 10),
          roomId: parseInt(roomId, 10),
          assetId: assetId ? parseInt(assetId, 10) : null,
          priorityId: parseInt(priorityId, 10),
          description: description.trim(),
          currentStatus: "Open",
        },
      });

      // Audit trail in StatusHistory
      await tx.statusHistory.create({
        data: {
          requestId: created.id,
          previousStatus: "None",
          newStatus: "Open",
          remarks: "Initial complaint logged by requester.",
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      message: "Request successfully created.",
      data: newRequest,
    });
  } catch (error: any) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create request." },
      { status: 500 }
    );
  }
}
