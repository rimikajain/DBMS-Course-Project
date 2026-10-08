import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const technicians = await prisma.technician.findMany({
      include: {
        user: true,
        assignments: {
          include: {
            request: true,
          },
          orderBy: { assignedDate: "desc" },
        },
      },
      orderBy: { user: { fullName: "asc" } },
    });

    return NextResponse.json({ success: true, data: technicians });
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch technicians." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phoneNumber, specialization, availabilityStatus, department } = body;

    if (!fullName?.trim() || !email?.trim() || !specialization?.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name, Email, and Specialization are required." },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: `A user with email ${email} already exists.` },
        { status: 400 }
      );
    }

    const newTechnician = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber?.trim() || "N/A",
          role: "Technician",
          department: department?.trim() || "Campus Facilities Operations",
        },
      });

      const tech = await tx.technician.create({
        data: {
          userId: user.id,
          specialization: specialization.trim(),
          availabilityStatus: availabilityStatus || "Available",
        },
        include: {
          user: true,
          assignments: true,
        },
      });

      return tech;
    });

    return NextResponse.json({
      success: true,
      message: "Technician successfully registered in database.",
      data: newTechnician,
    });
  } catch (error) {
    console.error("Error creating technician:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register technician." },
      { status: 500 }
    );
  }
}
