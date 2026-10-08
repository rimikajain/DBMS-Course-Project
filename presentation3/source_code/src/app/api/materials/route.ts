import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { materialName: "asc" },
    });

    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch materials." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { materialName, unitCost, quantityInStock, reorderLevel } = body;

    if (!materialName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Material name is required." },
        { status: 400 }
      );
    }

    const cost = parseFloat(unitCost);
    const stock = parseInt(quantityInStock, 10);
    const reorder = reorderLevel !== undefined ? parseInt(reorderLevel, 10) : 5;

    if (isNaN(cost) || cost < 0) {
      return NextResponse.json(
        { success: false, error: "Unit cost must be a non-negative number." },
        { status: 400 }
      );
    }

    if (isNaN(stock) || stock < 0) {
      return NextResponse.json(
        { success: false, error: "Stock quantity must be a non-negative number." },
        { status: 400 }
      );
    }

    // Check unique material name
    const existing = await prisma.material.findUnique({
      where: { materialName: materialName.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `A material named "${materialName.trim()}" already exists.` },
        { status: 400 }
      );
    }

    const material = await prisma.material.create({
      data: {
        materialName: materialName.trim(),
        unitCost: cost,
        quantityInStock: stock,
        reorderLevel: isNaN(reorder) || reorder < 0 ? 5 : reorder,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Material successfully added to inventory database.",
      data: material,
    });
  } catch (error) {
    console.error("Error creating material:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create material." },
      { status: 500 }
    );
  }
}
