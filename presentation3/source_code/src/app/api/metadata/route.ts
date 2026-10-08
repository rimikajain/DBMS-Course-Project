import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [buildings, rooms, categories, priorities, users, technicians, materials] =
      await Promise.all([
        prisma.building.findMany({
          orderBy: { buildingName: "asc" },
          include: { rooms: { orderBy: { roomNumber: "asc" } } },
        }),
        prisma.room.findMany({
          include: {
            building: true,
            assets: {
              include: { category: true },
            },
          },
          orderBy: { roomNumber: "asc" },
        }),
        prisma.category.findMany({ orderBy: { categoryName: "asc" } }),
        prisma.priority.findMany({ orderBy: { responseTimeHours: "asc" } }),
        prisma.user.findMany({
          where: { role: { in: ["Student", "Faculty", "Staff"] } },
          orderBy: { fullName: "asc" },
        }),
        prisma.technician.findMany({
          include: {
            user: true,
            assignments: {
              where: { status: { in: ["Assigned", "In Progress"] } },
            },
          },
          orderBy: { user: { fullName: "asc" } },
        }),
        prisma.material.findMany({ orderBy: { materialName: "asc" } }),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        buildings,
        rooms,
        categories,
        priorities,
        users,
        technicians,
        materials,
      },
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load system metadata." },
      { status: 500 }
    );
  }
}
