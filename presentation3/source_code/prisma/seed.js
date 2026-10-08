const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Campus Facility Database...');

  // Clean existing records in correct order
  await prisma.feedback.deleteMany();
  await prisma.cost.deleteMany();
  await prisma.requestMaterial.deleteMany();
  await prisma.workLog.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.request.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.material.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();
  await prisma.category.deleteMany();
  await prisma.priority.deleteMany();
  await prisma.building.deleteMany();

  // 1. Buildings
  const b1 = await prisma.building.create({ data: { buildingName: 'Academic Block A', campusLocation: 'North Campus', totalFloors: 4 } });
  const b2 = await prisma.building.create({ data: { buildingName: 'Science Complex', campusLocation: 'East Campus', totalFloors: 3 } });
  const b3 = await prisma.building.create({ data: { buildingName: 'Engineering Core', campusLocation: 'West Campus', totalFloors: 5 } });
  const b4 = await prisma.building.create({ data: { buildingName: 'Boys Hostel 1', campusLocation: 'South Campus Residential', totalFloors: 4 } });
  const b5 = await prisma.building.create({ data: { buildingName: 'Girls Hostel 2', campusLocation: 'South Campus Residential', totalFloors: 4 } });

  // 2. Rooms
  const r101 = await prisma.room.create({ data: { buildingId: b1.id, roomNumber: 'LH-101', floorLevel: 1 } });
  const r204 = await prisma.room.create({ data: { buildingId: b1.id, roomNumber: 'LH-204', floorLevel: 2 } });
  const r302 = await prisma.room.create({ data: { buildingId: b1.id, roomNumber: 'LH-302', floorLevel: 3 } });

  const rPhy = await prisma.room.create({ data: { buildingId: b2.id, roomNumber: 'PHY-LAB-01', floorLevel: 1 } });
  const rChem = await prisma.room.create({ data: { buildingId: b2.id, roomNumber: 'CHEM-LAB-02', floorLevel: 2 } });
  const rBio = await prisma.room.create({ data: { buildingId: b2.id, roomNumber: 'BIO-RES-03', floorLevel: 3 } });

  const rCs = await prisma.room.create({ data: { buildingId: b3.id, roomNumber: 'CS-LAB-301', floorLevel: 3 } });
  const rAi = await prisma.room.create({ data: { buildingId: b3.id, roomNumber: 'AI-ROBOTICS', floorLevel: 2 } });
  const rAud = await prisma.room.create({ data: { buildingId: b3.id, roomNumber: 'AUDITORIUM', floorLevel: 1 } });

  const rBh1 = await prisma.room.create({ data: { buildingId: b4.id, roomNumber: 'BH-105', floorLevel: 1 } });
  const rBh2 = await prisma.room.create({ data: { buildingId: b4.id, roomNumber: 'BH-214', floorLevel: 2 } });
  const rBh3 = await prisma.room.create({ data: { buildingId: b4.id, roomNumber: 'BH-308', floorLevel: 3 } });

  const rGh1 = await prisma.room.create({ data: { buildingId: b5.id, roomNumber: 'GH-102', floorLevel: 1 } });
  const rGh2 = await prisma.room.create({ data: { buildingId: b5.id, roomNumber: 'GH-205', floorLevel: 2 } });
  const rGh3 = await prisma.room.create({ data: { buildingId: b5.id, roomNumber: 'GH-310', floorLevel: 3 } });

  // 3. Categories
  const cElec = await prisma.category.create({ data: { categoryName: 'Electrical', slaHours: 24 } });
  const cHvac = await prisma.category.create({ data: { categoryName: 'HVAC & Air Conditioning', slaHours: 24 } });
  const cPlumb = await prisma.category.create({ data: { categoryName: 'Plumbing', slaHours: 12 } });
  const cCarp = await prisma.category.create({ data: { categoryName: 'Carpentry & Furniture', slaHours: 48 } });
  const cAv = await prisma.category.create({ data: { categoryName: 'Audio-Visual / IT', slaHours: 12 } });

  // 4. Priorities
  const pEmerg = await prisma.priority.create({ data: { levelName: 'Emergency', responseTimeHours: 2 } });
  const pHigh = await prisma.priority.create({ data: { levelName: 'High', responseTimeHours: 12 } });
  const pMed = await prisma.priority.create({ data: { levelName: 'Medium', responseTimeHours: 24 } });
  const pLow = await prisma.priority.create({ data: { levelName: 'Low', responseTimeHours: 48 } });

  // 5. Users
  const u1 = await prisma.user.create({ data: { fullName: 'Rimika Jain', email: 'rimika.jain@woxsen.edu.in', phoneNumber: '9876543210', role: 'Student', department: 'Computer Science & AI' } });
  const u2 = await prisma.user.create({ data: { fullName: 'Aarav Mehta', email: 'aarav.m@woxsen.edu.in', phoneNumber: '9876543211', role: 'Student', department: 'Mechanical Engineering' } });
  const u3 = await prisma.user.create({ data: { fullName: 'Dr. S. K. Raman', email: 'sk.raman@woxsen.edu.in', phoneNumber: '9876543212', role: 'Faculty', department: 'School of Technology' } });
  const u4 = await prisma.user.create({ data: { fullName: 'Col. Rajesh Nair', email: 'rajesh.nair@woxsen.edu.in', phoneNumber: '9876543213', role: 'Facility Manager', department: 'Campus Administration' } });

  // Technicians (Users + Technicians records)
  const uTech1 = await prisma.user.create({ data: { fullName: 'Ramesh Sharma', email: 'ramesh.tech@woxsen.edu.in', phoneNumber: '9876543214', role: 'Technician', department: 'Facility Maintenance' } });
  const uTech2 = await prisma.user.create({ data: { fullName: 'Suresh Verma', email: 'suresh.tech@woxsen.edu.in', phoneNumber: '9876543215', role: 'Technician', department: 'Facility Maintenance' } });
  const uTech3 = await prisma.user.create({ data: { fullName: 'Priya Patel', email: 'priya.tech@woxsen.edu.in', phoneNumber: '9876543216', role: 'Technician', department: 'Facility Maintenance' } });
  const uTech4 = await prisma.user.create({ data: { fullName: 'Manoj Kumar', email: 'manoj.tech@woxsen.edu.in', phoneNumber: '9876543217', role: 'Technician', department: 'Facility Maintenance' } });

  const tech1 = await prisma.technician.create({ data: { userId: uTech1.id, specialization: 'Electrical', availabilityStatus: 'Available' } });
  const tech2 = await prisma.technician.create({ data: { userId: uTech2.id, specialization: 'HVAC & Air Conditioning', availabilityStatus: 'Available' } });
  const tech3 = await prisma.technician.create({ data: { userId: uTech3.id, specialization: 'Plumbing', availabilityStatus: 'Available' } });
  const tech4 = await prisma.technician.create({ data: { userId: uTech4.id, specialization: 'Carpentry & Furniture', availabilityStatus: 'Available' } });

  // 6. Assets
  const a1 = await prisma.asset.create({ data: { roomId: r101.id, categoryId: cHvac.id, assetName: 'Daikin 2-Ton Cassette AC', serialNumber: 'AC-DAIK-2023-01', status: 'Operational', purchaseDate: new Date('2023-03-15') } });
  const a2 = await prisma.asset.create({ data: { roomId: r204.id, categoryId: cAv.id, assetName: 'Epson 4K Laser Projector', serialNumber: 'PRJ-EPS-2022-88', status: 'Operational', purchaseDate: new Date('2022-07-20') } });
  const a3 = await prisma.asset.create({ data: { roomId: r302.id, categoryId: cElec.id, assetName: 'Havells Ceiling Fan High-Speed', serialNumber: 'FAN-HAV-2021-12', status: 'Operational', purchaseDate: new Date('2021-08-10') } });
  const a4 = await prisma.asset.create({ data: { roomId: rPhy.id, categoryId: cPlumb.id, assetName: 'Aquaguard Commercial Water Purifier', serialNumber: 'WTR-AQU-2023-45', status: 'Operational', purchaseDate: new Date('2023-01-11') } });
  const a5 = await prisma.asset.create({ data: { roomId: rCs.id, categoryId: cHvac.id, assetName: 'Blue Star 3-Ton Precision AC', serialNumber: 'AC-BST-2024-09', status: 'Operational', purchaseDate: new Date('2024-02-05') } });
  const a6 = await prisma.asset.create({ data: { roomId: rBh1.id, categoryId: cPlumb.id, assetName: 'Jaquar Bathroom Sensor Flush Valve', serialNumber: 'VAL-JAG-2023-77', status: 'Operational', purchaseDate: new Date('2023-09-12') } });

  // 7. Materials Inventory
  const m1 = await prisma.material.create({ data: { materialName: '2.5uF Fan Capacitor', unitCost: 85.00, quantityInStock: 2, reorderLevel: 5 } });
  const m2 = await prisma.material.create({ data: { materialName: 'LED Tube Light 20W', unitCost: 180.00, quantityInStock: 4, reorderLevel: 10 } });
  const m3 = await prisma.material.create({ data: { materialName: 'Daikin AC Compressor Capacitor', unitCost: 650.00, quantityInStock: 8, reorderLevel: 3 } });
  const m4 = await prisma.material.create({ data: { materialName: 'Plumbing CPVC Pipe 1-inch (3m)', unitCost: 220.00, quantityInStock: 15, reorderLevel: 5 } });
  const m5 = await prisma.material.create({ data: { materialName: 'Bathroom Mixer Tap Spindle', unitCost: 350.00, quantityInStock: 12, reorderLevel: 4 } });
  const m6 = await prisma.material.create({ data: { materialName: 'Door Lock Mortise Cylinder', unitCost: 450.00, quantityInStock: 7, reorderLevel: 3 } });

  // 8. Requests (Including the exact records from Presentation 2)
  // Request 1: Completed
  const req1 = await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0001',
      userId: u1.id,
      assetId: a1.id,
      roomId: r101.id,
      priorityId: pHigh.id,
      description: 'AC not cooling properly during afternoon lectures in LH-101',
      currentStatus: 'Completed',
      dateSubmitted: new Date(Date.now() - 4 * 86400000),
      dateCompleted: new Date(Date.now() - 3.8 * 86400000)
    }
  });

  const asg1 = await prisma.assignment.create({
    data: {
      requestId: req1.id,
      techId: tech2.id,
      assignedDate: new Date(Date.now() - 3.9 * 86400000),
      status: 'Completed'
    }
  });

  const wl1 = await prisma.workLog.create({
    data: {
      assignmentId: asg1.id,
      hoursSpent: 3.5,
      description: 'Replaced burnt compressor capacitor and cleaned condenser cooling fins.'
    }
  });

  await prisma.requestMaterial.create({
    data: { logId: wl1.id, materialId: m3.id, quantityUsed: 1 }
  });

  await prisma.cost.createMany({
    data: [
      { requestId: req1.id, costType: 'Material', amount: 650.00 },
      { requestId: req1.id, costType: 'Labor', amount: 300.00 }
    ]
  });

  await prisma.feedback.create({
    data: {
      requestId: req1.id,
      rating: 5,
      comments: 'Very quick turnaround! Classroom cooled down before afternoon session.'
    }
  });

  // Request 2: Completed
  const req2 = await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0002',
      userId: u2.id,
      assetId: a3.id,
      roomId: r302.id,
      priorityId: pMed.id,
      description: 'Ceiling fan rattling noise and low rotation speed in LH-302',
      currentStatus: 'Completed',
      dateSubmitted: new Date(Date.now() - 3 * 86400000),
      dateCompleted: new Date(Date.now() - 2.8 * 86400000)
    }
  });

  const asg2 = await prisma.assignment.create({
    data: {
      requestId: req2.id,
      techId: tech1.id,
      assignedDate: new Date(Date.now() - 2.9 * 86400000),
      status: 'Completed'
    }
  });

  const wl2 = await prisma.workLog.create({
    data: {
      assignmentId: asg2.id,
      hoursSpent: 1.5,
      description: 'Replaced weakened 2.5uF running capacitor and tightened downrod clamp.'
    }
  });

  await prisma.requestMaterial.create({
    data: { logId: wl2.id, materialId: m1.id, quantityUsed: 1 }
  });

  await prisma.cost.createMany({
    data: [
      { requestId: req2.id, costType: 'Material', amount: 85.00 },
      { requestId: req2.id, costType: 'Labor', amount: 150.00 }
    ]
  });

  await prisma.feedback.create({
    data: {
      requestId: req2.id,
      rating: 4,
      comments: 'Noise eliminated completely. Fan running at full speed now.'
    }
  });

  // Request 3: Completed
  const req3 = await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0003',
      userId: u3.id,
      assetId: a2.id,
      roomId: r204.id,
      priorityId: pEmerg.id,
      description: 'Projector HDMI port connector physically bent prior to guest lecture',
      currentStatus: 'Completed',
      dateSubmitted: new Date(Date.now() - 2 * 86400000),
      dateCompleted: new Date(Date.now() - 1.9 * 86400000)
    }
  });

  const asg3 = await prisma.assignment.create({
    data: {
      requestId: req3.id,
      techId: tech1.id,
      assignedDate: new Date(Date.now() - 1.95 * 86400000),
      status: 'Completed'
    }
  });

  await prisma.workLog.create({
    data: {
      assignmentId: asg3.id,
      hoursSpent: 1.0,
      description: 'Re-aligned HDMI connector pins and replaced auxiliary patch cable.'
    }
  });

  await prisma.cost.create({
    data: { requestId: req3.id, costType: 'Labor', amount: 200.00 }
  });

  await prisma.feedback.create({
    data: {
      requestId: req3.id,
      rating: 5,
      comments: 'Exceptional service under emergency SLA. Lecture went smoothly!'
    }
  });

  // Request 4: In Progress
  const req4 = await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0004',
      userId: u1.id,
      assetId: a4.id,
      roomId: rPhy.id,
      priorityId: pHigh.id,
      description: 'Water purifier dispenser dripping continuously onto floor',
      currentStatus: 'In Progress',
      dateSubmitted: new Date(Date.now() - 1 * 86400000)
    }
  });

  const asg4 = await prisma.assignment.create({
    data: {
      requestId: req4.id,
      techId: tech3.id,
      assignedDate: new Date(Date.now() - 0.9 * 86400000),
      status: 'In Progress'
    }
  });

  await prisma.workLog.create({
    data: {
      assignmentId: asg4.id,
      hoursSpent: 2.0,
      description: 'Isolated main valve; inspected cracked filter housing, sourcing gasket.'
    }
  });

  // Request 5: In Progress
  const req5 = await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0005',
      userId: u2.id,
      assetId: a5.id,
      roomId: rCs.id,
      priorityId: pEmerg.id,
      description: 'AI & Robotics Lab central AC unit tripping main distribution breaker',
      currentStatus: 'In Progress',
      dateSubmitted: new Date(Date.now() - 0.5 * 86400000)
    }
  });

  await prisma.assignment.create({
    data: {
      requestId: req5.id,
      techId: tech2.id,
      assignedDate: new Date(Date.now() - 0.4 * 86400000),
      status: 'In Progress'
    }
  });

  // Request 6: Open (Unassigned)
  await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0006',
      userId: u1.id,
      assetId: null,
      roomId: rBh1.id,
      priorityId: pMed.id,
      description: 'Boys Hostel Room 105 door lock cylinder sticking; difficult to latch',
      currentStatus: 'Open',
      dateSubmitted: new Date(Date.now() - 0.2 * 86400000)
    }
  });

  // Request 7: Open (Unassigned)
  await prisma.request.create({
    data: {
      requestCode: 'REQ-2026-0007',
      userId: u3.id,
      assetId: null,
      roomId: rAud.id,
      priorityId: pHigh.id,
      description: 'Auditorium stage lighting dimmer flickering during rehearsals',
      currentStatus: 'Open',
      dateSubmitted: new Date(Date.now() - 0.1 * 86400000)
    }
  });

  // Status Histories audit logs
  await prisma.statusHistory.createMany({
    data: [
      { requestId: req1.id, previousStatus: 'Open', newStatus: 'Assigned', remarks: 'Assigned to Suresh Verma' },
      { requestId: req1.id, previousStatus: 'Assigned', newStatus: 'Completed', remarks: 'Compressor serviced and tested' },
      { requestId: req2.id, previousStatus: 'Open', newStatus: 'Assigned', remarks: 'Assigned to Ramesh Sharma' },
      { requestId: req2.id, previousStatus: 'Assigned', newStatus: 'Completed', remarks: 'Capacitor replaced' },
      { requestId: req3.id, previousStatus: 'Open', newStatus: 'Completed', remarks: 'Urgent seminar repair completed' },
      { requestId: req4.id, previousStatus: 'Open', newStatus: 'In Progress', remarks: 'Priya Patel currently working on site' },
      { requestId: req5.id, previousStatus: 'Open', newStatus: 'In Progress', remarks: 'Suresh Verma diagnosing compressor overload' }
    ]
  });

  console.log('Database successfully populated with realistic campus records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
