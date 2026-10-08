import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalRequests,
      openRequests,
      assignedRequests,
      inProgressRequests,
      completedRequests,
      cancelledRequests,
      totalCosts,
      feedbacks,
      buildings,
      recentRequests,
      materials,
    ] = await Promise.all([
      prisma.request.count(),
      prisma.request.count({ where: { currentStatus: "Open" } }),
      prisma.request.count({ where: { currentStatus: "Assigned" } }),
      prisma.request.count({ where: { currentStatus: "In Progress" } }),
      prisma.request.count({ where: { currentStatus: "Completed" } }),
      prisma.request.count({ where: { currentStatus: "Cancelled" } }),
      prisma.cost.aggregate({
        _sum: { amount: true },
      }),
      prisma.feedback.findMany({ select: { rating: true } }),
      prisma.building.findMany({
        include: {
          rooms: {
            include: {
              requests: {
                include: { costs: true },
              },
            },
          },
        },
      }),
      prisma.request.findMany({
        take: 5,
        orderBy: { dateSubmitted: "desc" },
        include: {
          user: true,
          room: { include: { building: true } },
          priority: true,
        },
      }),
      prisma.material.findMany({
        where: { quantityInStock: { lte: 5 } },
      }),
    ]);

    const avgRating =
      feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : "5.0";

    const totalExpenditure = totalCosts._sum.amount || 0;

    // Building Breakdown with Maintenance Cost & Active Job count
    const buildingStats = buildings.map((b) => {
      let bTotalReqs = 0;
      let bActiveReqs = 0;
      let bCost = 0;

      b.rooms.forEach((r) => {
        bTotalReqs += r.requests.length;
        r.requests.forEach((req) => {
          if (["Open", "Assigned", "In Progress"].includes(req.currentStatus)) {
            bActiveReqs++;
          }
          req.costs.forEach((c) => {
            bCost += c.amount;
          });
        });
      });

      return {
        id: b.id,
        name: b.buildingName,
        location: b.campusLocation,
        totalRequests: bTotalReqs,
        activeRequests: bActiveReqs,
        totalCost: bCost,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalRequests,
          pendingRequests: openRequests + assignedRequests,
          activeRequests: inProgressRequests,
          completedRequests,
          cancelledRequests,
          totalExpenditure,
          avgRating: parseFloat(avgRating),
          lowStockAlertsCount: materials.length,
        },
        buildingStats,
        recentRequests,
        lowStockMaterials: materials,
      },
    });
  } catch (error) {
    console.error("Error generating dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
