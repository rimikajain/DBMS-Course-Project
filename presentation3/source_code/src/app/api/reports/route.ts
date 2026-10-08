import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Pending Requests Ageing Report
    const pendingRequests = await prisma.request.findMany({
      where: {
        currentStatus: { in: ["Open", "Assigned", "In Progress"] },
      },
      include: {
        priority: true,
        room: { include: { building: true } },
        user: true,
      },
      orderBy: { dateSubmitted: "asc" },
    });

    const now = new Date();
    const ageingReport = pendingRequests.map((req) => {
      const diffMs = now.getTime() - new Date(req.dateSubmitted).getTime();
      const ageingHours = (diffMs / (1000 * 60 * 60)).toFixed(1);
      const isBreached = parseFloat(ageingHours) > req.priority.responseTimeHours;

      return {
        requestCode: req.requestCode,
        priority: req.priority.levelName,
        targetSlaHours: req.priority.responseTimeHours,
        status: req.currentStatus,
        building: req.room.building.buildingName,
        roomNumber: req.room.roomNumber,
        requester: req.user.fullName,
        dateSubmitted: req.dateSubmitted,
        ageingHours: parseFloat(ageingHours),
        isBreached,
      };
    });

    // 2. Building-wise Maintenance Expenditure
    const buildings = await prisma.building.findMany({
      include: {
        rooms: {
          include: {
            requests: {
              include: { costs: true },
            },
          },
        },
      },
    });

    const buildingCostReport = buildings.map((b) => {
      let totalIncidents = 0;
      let materialCost = 0;
      let laborCost = 0;

      b.rooms.forEach((r) => {
        totalIncidents += r.requests.length;
        r.requests.forEach((req) => {
          req.costs.forEach((c) => {
            if (c.costType === "Material") materialCost += c.amount;
            else if (c.costType === "Labor") laborCost += c.amount;
          });
        });
      });

      return {
        buildingName: b.buildingName,
        campusLocation: b.campusLocation,
        totalIncidents,
        materialCost,
        laborCost,
        totalExpenditure: materialCost + laborCost,
      };
    }).sort((a, b) => b.totalExpenditure - a.totalExpenditure);

    // 3. Technician Workload & Performance Summary
    const technicians = await prisma.technician.findMany({
      include: {
        user: true,
        assignments: {
          include: {
            workLogs: true,
            request: true,
          },
        },
      },
    });

    const technicianReport = technicians.map((t) => {
      const totalAssigned = t.assignments.length;
      const completedTasks = t.assignments.filter(
        (a) => a.request.currentStatus === "Completed" || a.status === "Completed"
      ).length;

      let totalHours = 0;
      let workLogCount = 0;

      t.assignments.forEach((a) => {
        a.workLogs.forEach((wl) => {
          totalHours += wl.hoursSpent;
          workLogCount++;
        });
      });

      const avgHoursPerLog =
        workLogCount > 0 ? (totalHours / workLogCount).toFixed(2) : "0.00";

      return {
        techName: t.user.fullName,
        specialization: t.specialization,
        availability: t.availabilityStatus,
        totalAssigned,
        completedTasks,
        activeTasks: totalAssigned - completedTasks,
        totalHoursLogged: totalHours,
        avgHoursPerLog: parseFloat(avgHoursPerLog),
      };
    });

    // 4. Spare Materials Inventory Deficit / Reorder Alert
    const materials = await prisma.material.findMany({
      orderBy: { quantityInStock: "asc" },
    });

    const inventoryReport = materials.map((m) => {
      const isDeficit = m.quantityInStock <= m.reorderLevel;
      const deficitQuantity = isDeficit ? m.reorderLevel - m.quantityInStock : 0;

      return {
        materialId: m.id,
        materialName: m.materialName,
        unitCost: m.unitCost,
        quantityInStock: m.quantityInStock,
        reorderLevel: m.reorderLevel,
        isDeficit,
        deficitQuantity,
        stockStatus: isDeficit ? "REORDER REQUIRED" : "SUFFICIENT",
      };
    });

    // 5. Virtual Facility Health Overview (v_FacilityHealthDashboard emulation)
    const facilityHealthOverview = buildings.map((b) => {
      let totalReqs = 0;
      let unassignedCount = 0;
      let activeCount = 0;
      let resolvedCount = 0;
      let totalExpense = 0;
      let ratings: number[] = [];

      b.rooms.forEach((r) => {
        r.requests.forEach((req: any) => {
          totalReqs++;
          if (req.currentStatus === "Open") unassignedCount++;
          else if (["Assigned", "In Progress"].includes(req.currentStatus)) activeCount++;
          else if (req.currentStatus === "Completed") resolvedCount++;

          req.costs?.forEach((c: any) => {
            totalExpense += c.amount;
          });

          if (req.feedback?.rating) {
            ratings.push(req.feedback.rating);
          }
        });
      });

      const avgRating =
        ratings.length > 0
          ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
          : "N/A";

      return {
        buildingName: b.buildingName,
        totalRequests: totalReqs,
        unassignedTickets: unassignedCount,
        activeJobs: activeCount,
        resolvedJobs: resolvedCount,
        avgUserSatisfaction: avgRating,
        totalMaintenanceExpense: totalExpense,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ageingReport,
        buildingCostReport,
        technicianReport,
        inventoryReport,
        facilityHealthOverview,
      },
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compile analytical reports." },
      { status: 500 }
    );
  }
}
