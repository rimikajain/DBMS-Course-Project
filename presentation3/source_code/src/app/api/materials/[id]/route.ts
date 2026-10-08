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
        { success: false, error: "Invalid material ID." },
        { status: 400 }
      );
    }

    const material = await prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      return NextResponse.json(
        { success: false, error: "Material not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: material });
  } catch (error) {
    console.error("Error fetching material:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch material." },
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
        { success: false, error: "Invalid material ID." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { materialName, unitCost, quantityInStock, reorderLevel } = body;

    const existing = await prisma.material.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Material not found." },
        { status: 404 }
      );
    }

    // Check name uniqueness if changed
    if (materialName && materialName.trim() !== existing.materialName) {
      const nameTaken = await prisma.material.findUnique({
        where: { materialName: materialName.trim() },
      });
      if (nameTaken) {
        return NextResponse.json(
          { success: false, error: `Material "${materialName.trim()}" already exists.` },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (materialName !== undefined) updateData.materialName = materialName.trim();
    if (unitCost !== undefined) {
      const cost = parseFloat(unitCost);
      if (isNaN(cost) || cost < 0) {
        return NextResponse.json(
          { success: false, error: "Unit cost must be a non-negative number." },
          { status: 400 }
        );
      }
      updateData.unitCost = cost;
    }
    if (quantityInStock !== undefined) {
      const stock = parseInt(quantityInStock, 10);
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { success: false, error: "Quantity in stock must be non-negative." },
          { status: 400 }
        );
      }
      updateData.quantityInStock = stock;
    }
    if (reorderLevel !== undefined) {
      const reorder = parseInt(reorderLevel, 10);
      if (isNaN(reorder) || reorder < 0) {
        return NextResponse.json(
          { success: false, error: "Reorder level must be non-negative." },
          { status: 400 }
        );
      }
      updateData.reorderLevel = reorder;
    }

    const updated = await prisma.material.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Material updated successfully in database.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update material." },
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
        { success: false, error: "Invalid material ID." },
        { status: 400 }
      );
    }

    const existing = await prisma.material.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Material not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete any usage records
      await tx.requestMaterial.deleteMany({
        where: { materialId: id },
      });

      // Delete material
      await tx.material.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Material "${existing.materialName}" successfully deleted from database.`,
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete material." },
      { status: 500 }
    );
  }
}
