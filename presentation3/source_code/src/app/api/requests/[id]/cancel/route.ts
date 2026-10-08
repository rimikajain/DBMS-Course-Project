import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id, 10);
    const body = await req.json().catch(() => ({}));
    const { reason = "Cancelled by user" } = body;

    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    if (request.currentStatus !== "Open") {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot cancel request. Only 'Open' requests can be cancelled (current status: '${request.currentStatus}').`,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.request.update({
        where: { id: requestId },
        data: { currentStatus: "Cancelled" },
      });

      await tx.statusHistory.create({
        data: {
          requestId,
          previousStatus: "Open",
          newStatus: "Cancelled",
          remarks: reason,
        },
      });

      return res;
    });

    return NextResponse.json({
      success: true,
      message: "Request cancelled successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error cancelling request:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel request." },
      { status: 500 }
    );
  }
}
