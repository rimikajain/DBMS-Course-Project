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
        { success: false, error: "Invalid technician ID." },
        { status: 400 }
      );
    }

    const tech = await prisma.technician.findUnique({
      where: { id },
      include: {
        user: true,
        assignments: {
          include: { request: true },
        },
      },
    });

    if (!tech) {
      return NextResponse.json(
        { success: false, error: "Technician not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tech });
  } catch (error) {
    console.error("Error fetching technician:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch technician." },
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
        { success: false, error: "Invalid technician ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { fullName, email, phoneNumber, specialization, availabilityStatus } = body;

    const existing = await prisma.technician.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Technician not found." },
        { status: 404 }
      );
    }

    // Check email uniqueness if email changed
    if (email && email.trim().toLowerCase() !== existing.user.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (emailTaken) {
        return NextResponse.json(
          { success: false, error: `Email ${email} is already in use by another user.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Update User details
      const userUpdate: any = {};
      if (fullName !== undefined) userUpdate.fullName = fullName.trim();
      if (email !== undefined) userUpdate.email = email.trim().toLowerCase();
      if (phoneNumber !== undefined) userUpdate.phoneNumber = phoneNumber.trim();

      if (Object.keys(userUpdate).length > 0) {
        await tx.user.update({
          where: { id: existing.userId },
          data: userUpdate,
        });
      }

      // Update Technician details
      const techUpdate: any = {};
      if (specialization !== undefined) techUpdate.specialization = specialization.trim();
      if (availabilityStatus !== undefined) techUpdate.availabilityStatus = availabilityStatus;

      const res = await tx.technician.update({
        where: { id },
        data: techUpdate,
        include: {
          user: true,
          assignments: true,
        },
      });

      return res;
    });

    return NextResponse.json({
      success: true,
      message: "Technician updated successfully in database.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating technician:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update technician." },
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
        { success: false, error: "Invalid technician ID." },
        { status: 400 }
      );
    }

    const existing = await prisma.technician.findUnique({
      where: { id },
      include: {
        user: true,
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
        { success: false, error: "Technician not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Clean up assignments for this technician
      for (const asg of existing.assignments) {
        for (const wl of asg.workLogs) {
          await tx.requestMaterial.deleteMany({ where: { logId: wl.id } });
        }
        await tx.workLog.deleteMany({ where: { assignmentId: asg.id } });
      }
      await tx.assignment.deleteMany({ where: { techId: id } });

      // Delete technician
      await tx.technician.delete({ where: { id } });

      // Delete user
      await tx.user.delete({ where: { id: existing.userId } });
    });

    return NextResponse.json({
      success: true,
      message: `Technician ${existing.user.fullName} successfully deleted from database.`,
    });
  } catch (error) {
    console.error("Error deleting technician:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete technician." },
      { status: 500 }
    );
  }
}
