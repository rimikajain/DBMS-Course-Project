-- ==============================================================================
-- PROJECT 41: CAMPUS FACILITY MAINTENANCE REQUEST MANAGEMENT SYSTEM
-- Subject: Database Management Systems (DBMS) - Project-Based Learning (PBL)
-- Student: Rimika Jain | Roll No: 25WU0101111 | AIMLRhinos'29 | Woxsen University
-- ==============================================================================

-- 1. DROP EXISTING TABLES (In Reverse Dependency Order)
DROP VIEW IF EXISTS v_FacilityHealthDashboard;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Costs;
DROP TABLE IF EXISTS Request_Materials;
DROP TABLE IF EXISTS Materials;
DROP TABLE IF EXISTS Work_Logs;
DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Technicians;
DROP TABLE IF EXISTS Status_History;
DROP TABLE IF EXISTS Requests;
DROP TABLE IF EXISTS Assets;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Priority;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Rooms;
DROP TABLE IF EXISTS Buildings;

-- ==============================================================================
-- 2. DDL: TABLE DEFINITIONS WITH INTEGRITY CONSTRAINTS (3NF NORMALIZED)
-- ==============================================================================

-- Buildings Table
CREATE TABLE Buildings (
    BuildingID INTEGER PRIMARY KEY AUTOINCREMENT,
    BuildingName VARCHAR(100) NOT NULL UNIQUE,
    CampusLocation VARCHAR(100) NOT NULL,
    TotalFloors INTEGER NOT NULL CHECK (TotalFloors > 0)
);

-- Rooms Table
CREATE TABLE Rooms (
    RoomID INTEGER PRIMARY KEY AUTOINCREMENT,
    BuildingID INTEGER NOT NULL,
    RoomNumber VARCHAR(20) NOT NULL,
    FloorLevel INTEGER NOT NULL CHECK (FloorLevel >= 0),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(BuildingID) ON DELETE RESTRICT,
    UNIQUE (BuildingID, RoomNumber)
);

-- Categories Table
CREATE TABLE Categories (
    CategoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    CategoryName VARCHAR(50) NOT NULL UNIQUE,
    SLA_Hours INTEGER NOT NULL CHECK (SLA_Hours > 0)
);

-- Priority Levels Table
CREATE TABLE Priority (
    PriorityID INTEGER PRIMARY KEY AUTOINCREMENT,
    LevelName VARCHAR(20) NOT NULL UNIQUE,
    ResponseTimeHours INTEGER NOT NULL CHECK (ResponseTimeHours > 0)
);

-- Users Table
CREATE TABLE Users (
    UserID INTEGER PRIMARY KEY AUTOINCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(120) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20) NOT NULL,
    Role VARCHAR(30) NOT NULL CHECK (Role IN ('Student', 'Faculty', 'Staff', 'Facility Manager', 'Technician')),
    Department VARCHAR(80) NOT NULL,
    CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Technicians Table
CREATE TABLE Technicians (
    TechID INTEGER PRIMARY KEY AUTOINCREMENT,
    UserID INTEGER NOT NULL UNIQUE,
    Specialization VARCHAR(50) NOT NULL,
    AvailabilityStatus VARCHAR(20) NOT NULL DEFAULT 'Available' 
        CHECK (AvailabilityStatus IN ('Available', 'Busy', 'On Leave')),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE RESTRICT
);

-- Assets Table
CREATE TABLE Assets (
    AssetID INTEGER PRIMARY KEY AUTOINCREMENT,
    RoomID INTEGER NOT NULL,
    CategoryID INTEGER NOT NULL,
    AssetName VARCHAR(100) NOT NULL,
    SerialNumber VARCHAR(50) NOT NULL UNIQUE,
    Status VARCHAR(20) NOT NULL DEFAULT 'Operational'
        CHECK (Status IN ('Operational', 'Faulty', 'Under Maintenance', 'Decommissioned')),
    PurchaseDate DATE NOT NULL,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID) ON DELETE RESTRICT,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE RESTRICT
);

-- Requests Table
CREATE TABLE Requests (
    RequestID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestCode VARCHAR(20) NOT NULL UNIQUE,
    UserID INTEGER NOT NULL,
    AssetID INTEGER NULL,
    RoomID INTEGER NOT NULL,
    PriorityID INTEGER NOT NULL,
    Description TEXT NOT NULL,
    CurrentStatus VARCHAR(20) NOT NULL DEFAULT 'Open'
        CHECK (CurrentStatus IN ('Open', 'Assigned', 'In Progress', 'Completed', 'Cancelled')),
    DateSubmitted DATETIME DEFAULT CURRENT_TIMESTAMP,
    DateCompleted DATETIME NULL,
    CONSTRAINT chk_closure_date CHECK (DateCompleted IS NULL OR DateCompleted >= DateSubmitted),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE RESTRICT,
    FOREIGN KEY (AssetID) REFERENCES Assets(AssetID) ON DELETE SET NULL,
    FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID) ON DELETE RESTRICT,
    FOREIGN KEY (PriorityID) REFERENCES Priority(PriorityID) ON DELETE RESTRICT
);

-- Status History Table (Audit Trail)
CREATE TABLE Status_History (
    StatusLogID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestID INTEGER NOT NULL,
    PreviousStatus VARCHAR(20) NOT NULL,
    NewStatus VARCHAR(20) NOT NULL,
    ChangedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Remarks TEXT NULL,
    FOREIGN KEY (RequestID) REFERENCES Requests(RequestID) ON DELETE CASCADE
);

-- Assignments Table
CREATE TABLE Assignments (
    AssignmentID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestID INTEGER NOT NULL,
    TechID INTEGER NOT NULL,
    AssignedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) NOT NULL DEFAULT 'Assigned'
        CHECK (Status IN ('Assigned', 'In Progress', 'Completed', 'Reassigned')),
    FOREIGN KEY (RequestID) REFERENCES Requests(RequestID) ON DELETE CASCADE,
    FOREIGN KEY (TechID) REFERENCES Technicians(TechID) ON DELETE RESTRICT
);

-- Work Logs Table
CREATE TABLE Work_Logs (
    LogID INTEGER PRIMARY KEY AUTOINCREMENT,
    AssignmentID INTEGER NOT NULL,
    LogDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    HoursSpent DECIMAL(4,2) NOT NULL CHECK (HoursSpent > 0 AND HoursSpent <= 24),
    Description TEXT NOT NULL,
    FOREIGN KEY (AssignmentID) REFERENCES Assignments(AssignmentID) ON DELETE CASCADE
);

-- Materials Inventory Table
CREATE TABLE Materials (
    MaterialID INTEGER PRIMARY KEY AUTOINCREMENT,
    MaterialName VARCHAR(100) NOT NULL UNIQUE,
    UnitCost DECIMAL(10,2) NOT NULL CHECK (UnitCost >= 0.00),
    QuantityInStock INTEGER NOT NULL CHECK (QuantityInStock >= 0),
    ReorderLevel INTEGER NOT NULL DEFAULT 5 CHECK (ReorderLevel >= 0)
);

-- Request Materials Used (Bridge Entity)
CREATE TABLE Request_Materials (
    LogID INTEGER NOT NULL,
    MaterialID INTEGER NOT NULL,
    QuantityUsed INTEGER NOT NULL CHECK (QuantityUsed > 0),
    PRIMARY KEY (LogID, MaterialID),
    FOREIGN KEY (LogID) REFERENCES Work_Logs(LogID) ON DELETE CASCADE,
    FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID) ON DELETE RESTRICT
);

-- Costs Ledger Table
CREATE TABLE Costs (
    CostID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestID INTEGER NOT NULL,
    CostType VARCHAR(30) NOT NULL 
        CHECK (CostType IN ('Material', 'Labor', 'Contractor', 'Other')),
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0.00),
    IncurredDate DATE NOT NULL,
    FOREIGN KEY (RequestID) REFERENCES Requests(RequestID) ON DELETE CASCADE
);

-- Feedback Table
CREATE TABLE Feedback (
    FeedbackID INTEGER PRIMARY KEY AUTOINCREMENT,
    RequestID INTEGER NOT NULL UNIQUE,
    Rating INTEGER NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comments TEXT NULL,
    SubmissionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RequestID) REFERENCES Requests(RequestID) ON DELETE CASCADE
);

-- ==============================================================================
-- 3. SAMPLE DATA SEEDING (REALISTIC CAMPUS RECORDS)
-- ==============================================================================

-- Buildings
INSERT INTO Buildings (BuildingName, CampusLocation, TotalFloors) VALUES
('Academic Block A', 'North Campus', 4),
('Science Complex', 'East Campus', 3),
('Engineering Core', 'West Campus', 5),
('Boys Hostel 1', 'South Campus Residential', 4),
('Girls Hostel 2', 'South Campus Residential', 4);

-- Rooms
INSERT INTO Rooms (BuildingID, RoomNumber, FloorLevel) VALUES
(1, 'LH-101', 1), (1, 'LH-204', 2), (1, 'LH-302', 3),
(2, 'PHY-LAB-01', 1), (2, 'CHEM-LAB-02', 2), (2, 'BIO-RES-03', 3),
(3, 'CS-LAB-301', 3), (3, 'AI-ROBOTICS', 2), (3, 'AUDITORIUM', 1),
(4, 'BH-105', 1), (4, 'BH-214', 2), (4, 'BH-308', 3),
(5, 'GH-102', 1), (5, 'GH-205', 2), (5, 'GH-310', 3);

-- Categories
INSERT INTO Categories (CategoryName, SLA_Hours) VALUES
('Electrical', 24),
('HVAC & Air Conditioning', 24),
('Plumbing', 12),
('Carpentry & Furniture', 48),
('Audio-Visual / IT', 12);

-- Priority Levels
INSERT INTO Priority (LevelName, ResponseTimeHours) VALUES
('Emergency', 2),
('High', 12),
('Medium', 24),
('Low', 48);

-- Users
INSERT INTO Users (FullName, Email, PhoneNumber, Role, Department) VALUES
('Rimika Jain', 'rimika.jain@woxsen.edu.in', '9876543210', 'Student', 'Computer Science & AI'),
('Aarav Mehta', 'aarav.m@woxsen.edu.in', '9876543211', 'Student', 'Mechanical Engineering'),
('Dr. S. K. Raman', 'sk.raman@woxsen.edu.in', '9876543212', 'Faculty', 'School of Technology'),
('Col. Rajesh Nair', 'rajesh.nair@woxsen.edu.in', '9876543213', 'Facility Manager', 'Campus Administration'),
('Ramesh Sharma', 'ramesh.tech@woxsen.edu.in', '9876543214', 'Technician', 'Facility Maintenance'),
('Suresh Verma', 'suresh.tech@woxsen.edu.in', '9876543215', 'Technician', 'Facility Maintenance'),
('Priya Patel', 'priya.tech@woxsen.edu.in', '9876543216', 'Technician', 'Facility Maintenance'),
('Manoj Kumar', 'manoj.tech@woxsen.edu.in', '9876543217', 'Technician', 'Facility Maintenance');

-- Technicians
INSERT INTO Technicians (UserID, Specialization, AvailabilityStatus) VALUES
(5, 'Electrical', 'Available'),
(6, 'HVAC & Air Conditioning', 'Available'),
(7, 'Plumbing', 'Available'),
(8, 'Carpentry & Furniture', 'Available');

-- Assets
INSERT INTO Assets (RoomID, CategoryID, AssetName, SerialNumber, Status, PurchaseDate) VALUES
(1, 2, 'Daikin 2-Ton Cassette AC', 'AC-DAIK-2023-01', 'Operational', '2023-03-15'),
(2, 5, 'Epson 4K Projector', 'PRJ-EPS-2022-88', 'Operational', '2022-07-20'),
(3, 1, 'Ceiling Fan High-Speed', 'FAN-HAV-2021-12', 'Operational', '2021-08-10'),
(4, 3, 'Water Purifier & Dispenser', 'WTR-AQU-2023-45', 'Operational', '2023-01-11'),
(7, 2, 'Blue Star 3-Ton Ductable AC', 'AC-BST-2024-09', 'Operational', '2024-02-05'),
(10, 3, 'Bathroom Flush Valve', 'VAL-JAG-2023-77', 'Operational', '2023-09-12');

-- Materials Inventory
INSERT INTO Materials (MaterialName, UnitCost, QuantityInStock, ReorderLevel) VALUES
('2.5uF Fan Capacitor', 85.00, 2, 5),               -- Low stock alert
('LED Tube Light 20W', 180.00, 4, 10),             -- Low stock alert
('Daikin AC Compressor Capacitor', 650.00, 8, 3),
('Plumbing CPVC Pipe 1-inch (3m)', 220.00, 15, 5),
('Bathroom Mixer Tap Spindle', 350.00, 12, 4),
('Door Lock Mortise Cylinder', 450.00, 7, 3);

-- Requests
INSERT INTO Requests (RequestCode, UserID, AssetID, RoomID, PriorityID, Description, CurrentStatus, DateSubmitted, DateCompleted) VALUES
('REQ-2026-0001', 1, 1, 1, 2, 'AC not cooling properly during afternoon lectures', 'Completed', '2026-09-10 09:30:00', '2026-09-10 14:00:00'),
('REQ-2026-0002', 2, 3, 3, 3, 'Ceiling fan rattling noise in LH-302', 'Completed', '2026-09-12 11:15:00', '2026-09-12 16:30:00'),
('REQ-2026-0003', 3, 2, 2, 1, 'Projector HDMI port damaged before seminar', 'Completed', '2026-09-15 08:45:00', '2026-09-15 10:15:00'),
('REQ-2026-0004', 1, 4, 4, 2, 'Water dispenser leaking continuously', 'In Progress', '2026-10-04 10:00:00', NULL),
('REQ-2026-0005', 2, 5, 7, 1, 'AI Lab AC tripping circuit breaker', 'In Progress', '2026-10-05 14:20:00', NULL),
('REQ-2026-0006', 1, NULL, 10, 3, 'Hostel room door lock jammed', 'Open', '2026-10-06 08:00:00', NULL);

-- Assignments
INSERT INTO Assignments (RequestID, TechID, AssignedDate, Status) VALUES
(1, 2, '2026-09-10 10:00:00', 'Completed'),
(2, 1, '2026-09-12 12:00:00', 'Completed'),
(3, 1, '2026-09-15 09:00:00', 'Completed'),
(4, 3, '2026-10-04 11:00:00', 'In Progress'),
(5, 2, '2026-10-05 15:00:00', 'In Progress');

-- Work Logs
INSERT INTO Work_Logs (AssignmentID, LogDate, HoursSpent, Description) VALUES
(1, '2026-09-10 13:30:00', 3.5, 'Replaced burnt compressor capacitor and cleaned filters.'),
(2, '2026-09-12 16:00:00', 1.5, 'Replaced faulty 2.5uF running capacitor and tightened blade screws.'),
(3, '2026-09-15 10:00:00', 1.0, 'Re-soldered HDMI input port connector on projector.'),
(4, '2026-10-04 16:00:00', 2.0, 'Diagnosed cracked internal tube; isolated water supply.');

-- Request Materials Junction
INSERT INTO Request_Materials (LogID, MaterialID, QuantityUsed) VALUES
(1, 3, 1),
(2, 1, 1);

-- Costs Ledger
INSERT INTO Costs (RequestID, CostType, Amount, IncurredDate) VALUES
(1, 'Material', 650.00, '2026-09-10'),
(1, 'Labor', 300.00, '2026-09-10'),
(2, 'Material', 85.00, '2026-09-12'),
(2, 'Labor', 150.00, '2026-09-12'),
(3, 'Labor', 200.00, '2026-09-15');

-- Feedback
INSERT INTO Feedback (RequestID, Rating, Comments, SubmissionDate) VALUES
(1, 5, 'Very quick resolution! AC cooling restored before 2 PM lecture.', '2026-09-10 15:00:00'),
(2, 4, 'Noise issue resolved promptly.', '2026-09-12 17:30:00'),
(3, 5, 'Exceptional support! Saved our morning seminar.', '2026-09-15 11:00:00');

-- ==============================================================================
-- 4. ANALYTICAL DATABASE VIEW DEFINITION
-- ==============================================================================
CREATE VIEW v_FacilityHealthDashboard AS
SELECT b.BuildingName,
       COUNT(DISTINCT r.RequestID) AS TotalRequests,
       SUM(CASE WHEN r.CurrentStatus = 'Open' THEN 1 ELSE 0 END) AS UnassignedTickets,
       SUM(CASE WHEN r.CurrentStatus = 'In Progress' THEN 1 ELSE 0 END) AS ActiveJobs,
       SUM(CASE WHEN r.CurrentStatus = 'Completed' THEN 1 ELSE 0 END) AS ResolvedJobs,
       ROUND(AVG(f.Rating), 1) AS AvgRequesterRating,
       IFNULL(SUM(c.Amount), 0.00) AS TotalMaintenanceExpense
FROM Buildings b
JOIN Rooms rm ON b.BuildingID = rm.BuildingID
LEFT JOIN Requests r ON rm.RoomID = r.RoomID
LEFT JOIN Feedback f ON r.RequestID = f.RequestID
LEFT JOIN Costs c ON r.RequestID = c.RequestID
GROUP BY b.BuildingID, b.BuildingName;

-- ==============================================================================
-- 5. ADVANCED SQL DEMONSTRATION QUERIES
-- ==============================================================================

-- Query 1: Multi-Table JOIN: Technician Load and Performance
SELECT u.FullName AS TechName, t.Specialization,
       COUNT(a.AssignmentID) AS TotalAssigned,
       SUM(CASE WHEN r.CurrentStatus = 'Completed' THEN 1 ELSE 0 END) AS CompletedTasks,
       ROUND(AVG(w.HoursSpent), 2) AS AvgHoursPerLog
FROM Technicians t
JOIN Users u ON t.UserID = u.UserID
LEFT JOIN Assignments a ON t.TechID = a.TechID
LEFT JOIN Requests r ON a.RequestID = r.RequestID
LEFT JOIN Work_Logs w ON a.AssignmentID = w.AssignmentID
GROUP BY t.TechID, u.FullName, t.Specialization;

-- Query 2: Grouped Aggregation & HAVING: Building-wise Maintenance Expenditure
SELECT b.BuildingName,
       COUNT(DISTINCT r.RequestID) AS TotalIncidents,
       SUM(CASE WHEN c.CostType='Material' THEN c.Amount ELSE 0 END) AS MaterialCost,
       SUM(CASE WHEN c.CostType='Labor' THEN c.Amount ELSE 0 END) AS LaborCost,
       SUM(c.Amount) AS TotalExpenditure
FROM Buildings b
JOIN Rooms rm ON b.BuildingID = rm.BuildingID
JOIN Requests r ON rm.RoomID = r.RoomID
JOIN Costs c ON r.RequestID = c.RequestID
GROUP BY b.BuildingID, b.BuildingName
HAVING SUM(c.Amount) > 0.00
ORDER BY TotalExpenditure DESC;

-- Query 3: Correlated Subquery: Unresolved Tickets Ageing Analysis
SELECT r.RequestCode, p.LevelName AS Priority, r.CurrentStatus, r.DateSubmitted,
       ROUND((JULIANDAY('now') - JULIANDAY(r.DateSubmitted)) * 24, 1) AS AgeingHours
FROM Requests r
JOIN Priority p ON r.PriorityID = p.PriorityID
WHERE r.CurrentStatus NOT IN ('Completed', 'Cancelled')
ORDER BY AgeingHours DESC;

-- Query 4: Inventory Reorder Warnings
SELECT MaterialName, QuantityInStock, ReorderLevel, UnitCost,
       (ReorderLevel - QuantityInStock) AS DeficitQuantity
FROM Materials
WHERE QuantityInStock <= ReorderLevel;

-- Query 5: Executive Dashboard View Query
SELECT * FROM v_FacilityHealthDashboard;
