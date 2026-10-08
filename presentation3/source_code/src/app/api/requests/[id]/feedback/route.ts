import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id, 10);
    const body = await req.json();
    const { rating, comments } = body;

    const r = parseInt(rating, 10);
    if (isNaN(r) || r < 1 || r > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { feedback: true },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
    }

    if (request.currentStatus !== "Completed") {
      return NextResponse.json(
        { success: false, error: "Feedback can only be submitted for completed requests." },
        { status: 400 }
      );
    }

    if (request.feedback) {
      return NextResponse.json(
        { success: false, error: "Feedback has already been submitted for this request." },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        requestId,
        rating: r,
        comments: comments?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback,
    });
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit feedback." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id, 10);
    const body = await req.json();
    const { rating, comments } = body;

    const r = parseInt(rating, 10);
    if (isNaN(r) || r < 1 || r > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5." },
        { status: 400 }
      );
    }

    const updated = await prisma.feedback.update({
      where: { requestId },
      data: {
        rating: r,
        comments: comments?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update feedback." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id, 10);
    await prisma.feedback.deleteMany({
      where: { requestId },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete feedback." },
      { status: 500 }
    );
  }
}

