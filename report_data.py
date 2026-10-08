# report_data.py
# Structured datasets, tables, and text content for DBMS PBL Final Report

STUDENT_NAME = "Rimika Jain"
ROLL_NUMBER = "25WU0101111"
PROGRAM = "B.Tech Computer Science & Engineering (Artificial Intelligence & Machine Learning)"
SECTION = "AIMLRhinos'29"
UNIVERSITY = "Woxsen University, School of Technology"
PROJECT_TITLE = "DESIGN AND IMPLEMENTATION OF A DATABASE MANAGEMENT SYSTEM FOR CAMPUS FACILITY MAINTENANCE REQUEST MANAGEMENT SYSTEM"
SUBMISSION_DATE = "October 08, 2026"
ACADEMIC_YEAR = "2026 – 27"
FACULTY_NAME = "Dr. Course Coordinator / Faculty Mentor"
MOBILE = "+91 98765 43210"
EMAIL = "rimika.jain@woxsen.edu.in"
GITHUB_REPO = "https://github.com/rimikajain/DBMS-Course-Project.git"

# Table of Contents
TOC_DATA = [
    ["Contents", "Page No."],
    ["Abstract", "1"],
    ["LIST OF TABLES", "2"],
    ["LIST OF FIGURES", "3"],
    ["LIST OF ACRONYMS", "4"],
    ["1. PROBLEM STATEMENT, SOLUTION STRATEGY AND ER DIAGRAM", "5"],
    ["1.1 Problem Statement", "5"],
    ["1.2 Objectives", "5"],
    ["1.3 Scope and Assumptions", "6"],
    ["1.4 Proposed Solution Strategy", "6"],
    ["1.5 Functional Requirements", "7"],
    ["1.6 Entity-Relationship Diagram (ERD)", "8"],
    ["1.7 Entity and Relationship Summary", "9"],
    ["2. LOGICAL DATABASE DESIGN", "10"],
    ["2.1 Relational Schema", "10"],
    ["2.2 Keys and Integrity Constraints", "11"],
    ["2.3 Functional Dependencies", "12"],
    ["2.4 Normalization up to Third Normal Form (3NF)", "13"],
    ["2.5 Data Dictionary", "14"],
    ["2.6 Implementation of Logical Design: DDL and Sample Data", "16"],
    ["3. APPLICATION DEVELOPMENT USING LOGICAL DATABASE DESIGN", "18"],
    ["3.1 Application Overview", "18"],
    ["3.2 Development Environment and Database Connectivity", "18"],
    ["3.3 Application Modules and Database Mapping", "19"],
    ["3.4 CRUD Operations", "20"],
    ["3.5 Business Rules, Validation and Error Handling", "21"],
    ["3.6 Reports and Database Operations", "22"],
    ["3.7 Application Screens", "23"],
    ["3.8 Testing and Results", "27"],
    ["4. CONCLUSION", "29"],
    ["4.1 Limitations and Future Enhancements", "29"],
    ["5. REFERENCES", "30"],
    ["6. APPENDICES", "31"],
    ["Appendix A - Complete Database Script", "31"],
    ["Appendix B - Application Source Code", "33"],
    ["Appendix C - Additional Test Data and Outputs", "34"]
]

# List of Tables
LOT_DATA = [
    ["Table No.", "Table Title", "Page No."],
    ["Table 1", "Scope and Assumptions", "6"],
    ["Table 2", "Proposed Solution Strategy", "6"],
    ["Table 3", "Functional Requirements", "7"],
    ["Table 4", "Entity and Relationship Summary", "9"],
    ["Table 5", "Relational Schema", "10"],
    ["Table 6", "Keys and Integrity Constraints", "11"],
    ["Table 7", "Normalization Status up to 3NF", "13"],
    ["Table 8", "Data Dictionary", "14"],
    ["Table 9", "Database Implementation Environment", "16"],
    ["Table 10", "Application Development Environment", "18"],
    ["Table 11", "Application Module-to-Database Mapping", "19"],
    ["Table 12", "CRUD Operations", "20"],
    ["Table 13", "Business Rules, Validation and Error Handling", "21"],
    ["Table 14", "Reports and Database Operations", "22"],
    ["Table 15", "Test Cases", "27"]
]

# List of Figures
LOF_DATA = [
    ["Figure No.", "Figure Title", "Page No."],
    ["Figure 1", "Entity-Relationship Diagram of the Proposed System", "8"],
    ["Figure 2", "Executive Maintenance Dashboard and Key Performance Indicators", "23"],
    ["Figure 3", "Facility Maintenance Request Management and Triage View", "24"],
    ["Figure 4", "Active Technician Roster and Workload Allocation Console", "25"],
    ["Figure 5", "Spare Parts Inventory and Material Stock Tracking Interface", "26"]
]

# List of Acronyms
ACRONYMS_DATA = [
    ["Acronym", "Expansion"],
    ["1NF", "First Normal Form"],
    ["2NF", "Second Normal Form"],
    ["3NF", "Third Normal Form"],
    ["ACID", "Atomicity, Consistency, Isolation, Durability"],
    ["API", "Application Programming Interface"],
    ["BCNF", "Boyce-Codd Normal Form"],
    ["CRUD", "Create, Read, Update, Delete"],
    ["CSAT", "Customer Satisfaction Score"],
    ["DDL", "Data Definition Language"],
    ["DML", "Data Manipulation Language"],
    ["DBMS", "Database Management System"],
    ["ERD", "Entity-Relationship Diagram"],
    ["FK", "Foreign Key"],
    ["GUI", "Graphical User Interface"],
    ["HVAC", "Heating, Ventilation, and Air Conditioning"],
    ["ORM", "Object-Relational Mapping"],
    ["PK", "Primary Key"],
    ["RDBMS", "Relational Database Management System"],
    ["REST", "Representational State Transfer"],
    ["SLA", "Service Level Agreement"],
    ["SQL", "Structured Query Language"],
    ["UI", "User Interface"]
]

# Table 1: Scope and Assumptions
TABLE_1_SCOPE = [
    ["Item", "Description"],
    ["In Scope", "End-to-end complaint lifecycle management: incident submission, category classification, priority triage, technician work order dispatching, labor and spare parts logging, real-time inventory decrementing, ticket closure, and customer satisfaction (CSAT) rating collection; role support for Students/Faculty, Facility Supervisors, and Trade Technicians across academic blocks, laboratories, lecture halls, and residential hostels."],
    ["Out of Scope / Exclusions", "External procurement vendor bidding contracts, online banking payment gateway settlement for billings, physical biometric attendance clocking, structural architectural AutoCAD drafting, and live surveillance video feeds."],
    ["Assumptions", "1. All requesters authenticate with valid institutional credentials.\n2. Each reported maintenance request is associated with a distinct physical room or asset.\n3. Standard maintenance operating hours are 08:00 to 18:00 daily, with 24/7 on-call dispatch reserved for Emergency breakdowns.\n4. Inventory stock levels are decremented atomically upon work order completion."]
]

# Table 2: Proposed Solution Strategy
TABLE_2_SOLUTION = [
    ["Solution Element", "Project-Specific Description"],
    ["Primary Users / Roles", "1. Requesters: Students, faculty members, lab instructors, and administrative staff reporting breakdowns.\n2. Facility Supervisors / Dispatchers: Triage complaints, assign technicians, monitor active backlog, and review SLA health.\n3. Field Technicians: Certified trade specialists (Carpentry, Plumbing, Electrical, HVAC) executing repairs, logging labor hours, and consuming spare materials."],
    ["Major Application Modules", "1. Executive Operational Dashboard: Visual KPI metric dials, backlog counts, active tasks, expenditure, and inventory deficit alerts.\n2. Request Management Console: Tabular viewing, multi-attribute searching, status filtering, editing, and deletion.\n3. Complaint Submission Portal: Clean input forms for capturing location, asset, priority, and description.\n4. Technician Service Console: Real-time roster, specialization tagging, active load monitoring (max 3 tasks limit), and job assignment.\n5. Spare Parts Inventory: Catalog tracking, stock quantity monitoring, unit costs, and replenishment triggers."],
    ["Proposed Workflow", "Incident Discovery -> Form Submission (Room, Asset, Priority, Category, Description) -> Unique Request Code Generation -> Supervisor Triage & Assignment to Available Technician -> Status Update ('Open' -> 'Assigned' -> 'In Progress') -> Field Diagnostics & Repair Execution -> Technician Work Log Entry (Hours Worked + Parts Used) -> Atomic Inventory Stock Decrement -> Maintenance Cost Compilation (Materials + Labor) -> Job Sign-off ('Completed') -> Requester CSAT Rating & Feedback Collection."],
    ["Important Business Rules", "1. Unique alphanumeric tracking code format (REQ-YYYY-NNNN).\n2. Technician active workload cap: maximum 3 concurrent active assignments.\n3. Strict status lifecycle transition state machine: Open -> Assigned -> In Progress -> Completed / Cancelled.\n4. Non-negative constraints on material quantities in stock and monetary costs.\n5. Closure requires recorded labor hours and parts consumption entries."],
    ["Expected Reports / Outputs", "1. Pending Incident Backlog grouped by Urgency and Ageing SLA.\n2. Campus Building Maintenance Expenditure analysis.\n3. Technician Workload and Turnaround Performance distribution.\n4. Low Spare Parts Inventory Deficit and Reorder Trigger alerts.\n5. CSAT Star Rating distribution and quality trends."]
]

# Table 3: Functional Requirements
TABLE_3_FR = [
    ["Req. ID", "Functional Requirement", "Remarks / Priority"],
    ["FR-01", "Incident Logging & Verification: Students and faculty must be able to log facility breakdowns specifying building, room, asset, urgency priority, and narrative fault description with automatic generation of a unique request tracking code.", "High / Core"],
    ["FR-02", "Technician Workload Triage & Dispatch: Facility supervisors must assign open maintenance tickets to qualified trade technicians while enforcing a strict maximum threshold of 3 concurrent active tasks per technician.", "High / Core"],
    ["FR-03", "Labor Logging & Spare Parts Consumption: Field technicians must record labor hours expended and select replacement materials utilized, triggering atomic database decrements from available inventory stock without negative balances.", "High / Core"],
    ["FR-04", "Multi-Attribute Search & Dynamic Filtering: Users and dispatchers must be able to filter maintenance requests across multiple criteria including ticket status, campus block, priority level, assigned technician, and free-text search.", "Medium / Operational"],
    ["FR-05", "Operational Health Analytics & CSAT Review: The system must dynamically compute campus building expenditure totals, SLA compliance indicators, technician resolution times, and collect 1 to 5 star customer satisfaction ratings.", "High / Analytical"]
]

# Table 4: Entity and Relationship Summary
TABLE_4_ENTITIES = [
    ["Entity / Relationship", "Major Attributes / Cardinality", "Purpose / Rule"],
    ["Buildings", "BuildingID (PK), Name, Address, CampusLocation\nCardinality: 1:N with Rooms", "Models physical infrastructure blocks across campus. Name is unique."],
    ["Rooms", "RoomID (PK), RoomNumber, FloorLevel, BuildingID (FK)\nCardinality: 1:N with Assets, 1:N with Requests", "Identifies discrete classrooms, labs, offices, and hostel rooms. BuildingID references Buildings."],
    ["Assets", "AssetID (PK), AssetName, Type, PurchaseDate, Status, RoomID (FK)\nCardinality: 1:N with Requests", "Tracks high-value equipment (AC units, projectors, water purifiers). RoomID references Rooms."],
    ["Users", "UserID (PK), FirstName, LastName, Email, PhoneNumber, UserRole\nCardinality: 1:N with Requests", "Maintains registered student, faculty, and administrative profiles. Email is unique."],
    ["Categories", "CategoryID (PK), CategoryName\nCardinality: 1:N with Requests", "Classifies trade disciplines: Electrical, Plumbing, HVAC, Carpentry, General."],
    ["Priority", "PriorityID (PK), LevelName, ResponseTime\nCardinality: 1:N with Requests", "Defines SLA resolution targets: Emergency (2h), High (6h), Medium (24h), Low (48h)."],
    ["Requests", "RequestID (PK), RequestCode, UserID (FK), RoomID (FK), AssetID (FK), CategoryID (FK), PriorityID (FK), Description, DateSubmitted, CurrentStatus", "Central transaction hub representing maintenance tickets. RequestCode is unique."],
    ["Technicians", "TechnicianID (PK), FirstName, LastName, Specialization, AvailabilityStatus\nCardinality: 1:N with Assignments", "Certified campus repair staff. AvailabilityStatus reflects current dispatch readiness."],
    ["Assignments", "AssignmentID (PK), RequestID (FK), TechnicianID (FK), AssignmentDate, CompletionDate\nCardinality: 1:N with Work_Logs", "Maps requests to technicians. Enforces max 3 active work orders per technician."],
    ["Work_Logs", "LogID (PK), AssignmentID (FK), LogEntryDate, Description, HoursSpent\nCardinality: N:1 with Assignments", "Captures detailed labor hours and repair notes recorded by technicians."],
    ["Materials", "MaterialID (PK), MaterialName, UnitCost, QuantityInStock, ReorderLevel\nCardinality: 1:N with Request_Materials", "Maintains replacement parts catalog and current inventory levels."],
    ["Request_Materials", "RequestID (FK), MaterialID (FK), QuantityUsed\nCardinality: M:N associative entity", "Records spare parts consumed per maintenance job. Decrements stock atomically."],
    ["Costs", "CostID (PK), RequestID (FK), CostType, Amount, IncurredDate\nCardinality: N:1 with Requests", "Stores ledger records for material consumption and labor charges."],
    ["Status_History", "StatusLogID (PK), RequestID (FK), StatusChangeDate, PreviousStatus, NewStatus\nCardinality: N:1 with Requests", "Immutable audit trail capturing all state transitions across ticket lifecycles."],
    ["Feedback", "FeedbackID (PK), RequestID (FK), Rating, Comments, SubmissionDate\nCardinality: 1:1 with Requests", "Captures requester satisfaction ratings (1-5 scale) upon ticket completion."]
]

# Table 5: Relational Schema
TABLE_5_SCHEMA = [
    ["S.No.", "Table Name", "Relational Schema Definition & Foreign Key Mappings"],
    ["1", "Buildings", "Buildings(BuildingID [PK], Name, Address, CampusLocation)"],
    ["2", "Rooms", "Rooms(RoomID [PK], RoomNumber, FloorLevel, BuildingID [FK references Buildings.BuildingID])"],
    ["3", "Categories", "Categories(CategoryID [PK], CategoryName)"],
    ["4", "Priority", "Priority(PriorityID [PK], LevelName, ResponseTime)"],
    ["5", "Users", "Users(UserID [PK], FirstName, LastName, Email, PhoneNumber, UserRole)"],
    ["6", "Technicians", "Technicians(TechnicianID [PK], FirstName, LastName, Specialization, AvailabilityStatus)"],
    ["7", "Assets", "Assets(AssetID [PK], AssetName, Type, PurchaseDate, Status, RoomID [FK references Rooms.RoomID])"],
    ["8", "Requests", "Requests(RequestID [PK], RequestCode, UserID [FK], RoomID [FK], AssetID [FK], CategoryID [FK], PriorityID [FK], Description, DateSubmitted, CurrentStatus)"],
    ["9", "Status_History", "Status_History(StatusLogID [PK], RequestID [FK references Requests.RequestID], StatusChangeDate, PreviousStatus, NewStatus)"],
    ["10", "Assignments", "Assignments(AssignmentID [PK], RequestID [FK references Requests.RequestID], TechnicianID [FK references Technicians.TechnicianID], AssignmentDate, CompletionDate)"],
    ["11", "Work_Logs", "Work_Logs(LogID [PK], AssignmentID [FK references Assignments.AssignmentID], LogEntryDate, Description, HoursSpent)"],
    ["12", "Materials", "Materials(MaterialID [PK], MaterialName, UnitCost, QuantityInStock, ReorderLevel)"],
    ["13", "Request_Materials", "Request_Materials(RequestID [FK references Requests.RequestID], MaterialID [FK references Materials.MaterialID], QuantityUsed) [Composite PK: (RequestID, MaterialID)]"],
    ["14", "Costs", "Costs(CostID [PK], RequestID [FK references Requests.RequestID], CostType, Amount, IncurredDate)"],
    ["15", "Feedback", "Feedback(FeedbackID [PK], RequestID [FK references Requests.RequestID], Rating, Comments, SubmissionDate)"]
]

# Table 6: Keys and Integrity Constraints
TABLE_6_CONSTRAINTS = [
    ["Table Name", "Key / Constraint", "Attribute(s)", "Business Rule Enforced"],
    ["Buildings", "PRIMARY KEY", "BuildingID", "Guarantees unique identification for each campus building."],
    ["Buildings", "UNIQUE", "Name", "Prevents duplicate building names across campus infrastructure."],
    ["Rooms", "FOREIGN KEY", "BuildingID", "Enforces referential integrity with Buildings (ON DELETE RESTRICT)."],
    ["Users", "UNIQUE", "Email", "Ensures each student/faculty possesses a unique institutional email."],
    ["Assets", "CHECK", "Status IN ('Operational', 'Degraded', 'Faulty', 'Decommissioned')", "Restricts asset condition to valid lifecycle states."],
    ["Requests", "PRIMARY KEY", "RequestID", "Surrogate primary key for unique incident referencing."],
    ["Requests", "UNIQUE", "RequestCode", "Enforces institutional tracking code uniqueness (e.g., REQ-2026-0001)."],
    ["Requests", "FOREIGN KEY", "UserID, RoomID, PriorityID, CategoryID", "Guarantees valid requester, physical room, priority SLA, and trade domain."],
    ["Requests", "CHECK", "CurrentStatus IN ('Open', 'Assigned', 'In Progress', 'Completed', 'Cancelled')", "Enforces valid states within the complaint lifecycle state machine."],
    ["Assignments", "FOREIGN KEY", "RequestID, TechnicianID", "Links maintenance requests to qualified technicians (ON DELETE CASCADE)."],
    ["Work_Logs", "CHECK", "HoursSpent > 0.0 AND HoursSpent <= 24.0", "Guarantees reported labor duration falls within realistic work bounds."],
    ["Materials", "CHECK", "QuantityInStock >= 0", "Prevents negative inventory balance during spare parts consumption."],
    ["Materials", "CHECK", "UnitCost >= 0.0", "Ensures inventory unit prices cannot be negative values."],
    ["Request_Materials", "PRIMARY KEY", "(RequestID, MaterialID)", "Composite primary key uniquely identifies part consumption per ticket."],
    ["Request_Materials", "CHECK", "QuantityUsed > 0", "Requires at least one unit when recording parts consumption."],
    ["Costs", "CHECK", "Amount >= 0.0", "Guarantees maintenance expenses are non-negative monetary figures."],
    ["Feedback", "CHECK", "Rating >= 1 AND Rating <= 5", "Enforces standard 5-star customer satisfaction evaluation scale."]
]

# Table 7: Normalization Status up to 3NF
TABLE_7_NORMALIZATION = [
    ["Relation Name", "1NF", "2NF", "3NF", "BCNF", "Remarks / Decomposition"],
    ["Buildings", "Yes", "Yes", "Yes", "Yes", "All attributes are atomic; no partial or transitive dependencies."],
    ["Rooms", "Yes", "Yes", "Yes", "Yes", "RoomNumber and FloorLevel depend solely on RoomID."],
    ["Assets", "Yes", "Yes", "Yes", "Yes", "Asset equipment attributes depend strictly on AssetID candidate key."],
    ["Users", "Yes", "Yes", "Yes", "Yes", "Contact and role attributes depend solely on UserID."],
    ["Priority", "Yes", "Yes", "Yes", "Yes", "ResponseTime depends solely on PriorityID."],
    ["Requests", "Yes", "Yes", "Yes", "Yes", "Decomposed to separate location, requester, priority, and category tables, removing transitive functional dependencies."],
    ["Assignments", "Yes", "Yes", "Yes", "Yes", "Assignment timestamps depend strictly on AssignmentID."],
    ["Work_Logs", "Yes", "Yes", "Yes", "Yes", "Labor log entries depend solely on LogID."],
    ["Materials", "Yes", "Yes", "Yes", "Yes", "Pricing and inventory quantities depend solely on MaterialID."],
    ["Request_Materials", "Yes", "Yes", "Yes", "Yes", "Composite key (RequestID, MaterialID) -> QuantityUsed; fully functionally dependent."],
    ["Costs", "Yes", "Yes", "Yes", "Yes", "Expense items depend strictly on CostID."],
    ["Feedback", "Yes", "Yes", "Yes", "Yes", "User ratings depend strictly on FeedbackID."]
]

# Table 8: Data Dictionary
TABLE_8_DATA_DICT = [
    ["Table", "Attribute", "Data Type", "Key / Constraint", "Description"],
    ["Requests", "RequestID", "INTEGER", "PK, AUTO_INCREMENT", "Unique surrogate identifier for maintenance requests."],
    ["Requests", "RequestCode", "VARCHAR(30)", "UNIQUE, NOT NULL", "Human-readable tracking code (e.g. REQ-2026-0001)."],
    ["Requests", "UserID", "INTEGER", "FK, NOT NULL", "References Users.UserID of the reporting student/staff."],
    ["Requests", "RoomID", "INTEGER", "FK, NOT NULL", "References Rooms.RoomID where the breakdown occurred."],
    ["Requests", "AssetID", "INTEGER", "FK, NULL", "References Assets.AssetID for specific equipment faults."],
    ["Requests", "CategoryID", "INTEGER", "FK, NOT NULL", "References Categories.CategoryID (Electrical, Plumbing, etc.)."],
    ["Requests", "PriorityID", "INTEGER", "FK, NOT NULL", "References Priority.PriorityID determining SLA urgency."],
    ["Requests", "Description", "TEXT", "NOT NULL", "Detailed textual description of the maintenance issue."],
    ["Requests", "DateSubmitted", "DATETIME", "NOT NULL, DEFAULT NOW", "Timestamp when complaint was logged into system."],
    ["Requests", "CurrentStatus", "VARCHAR(20)", "CHECK, DEFAULT 'Open'", "Current lifecycle state ('Open','Assigned','In Progress','Completed','Cancelled')."],
    ["Technicians", "TechnicianID", "INTEGER", "PK, AUTO_INCREMENT", "Unique identifier for service technician."],
    ["Technicians", "FirstName", "VARCHAR(50)", "NOT NULL", "Given name of the technician."],
    ["Technicians", "LastName", "VARCHAR(50)", "NOT NULL", "Surname of the technician."],
    ["Technicians", "Specialization", "VARCHAR(50)", "NOT NULL", "Trade discipline (Plumbing, Electrical, Carpentry, HVAC)."],
    ["Technicians", "AvailabilityStatus", "VARCHAR(20)", "CHECK, DEFAULT 'Available'", "Status flag ('Available', 'Busy', 'On Leave')."],
    ["Assignments", "AssignmentID", "INTEGER", "PK, AUTO_INCREMENT", "Unique identifier for technician work assignment."],
    ["Assignments", "RequestID", "INTEGER", "FK, NOT NULL", "References Requests.RequestID being assigned."],
    ["Assignments", "TechnicianID", "INTEGER", "FK, NOT NULL", "References Technicians.TechnicianID allocated to the task."],
    ["Assignments", "AssignmentDate", "DATETIME", "NOT NULL, DEFAULT NOW", "Timestamp when assignment was dispatched."],
    ["Assignments", "CompletionDate", "DATETIME", "NULL", "Timestamp when technician marked task as completed."],
    ["Materials", "MaterialID", "INTEGER", "PK, AUTO_INCREMENT", "Unique identifier for spare parts inventory item."],
    ["Materials", "MaterialName", "VARCHAR(100)", "NOT NULL, UNIQUE", "Descriptive name of the spare material component."],
    ["Materials", "UnitCost", "DECIMAL(10,2)", "CHECK >= 0, NOT NULL", "Standard procurement cost per unit in INR (₹)."],
    ["Materials", "QuantityInStock", "INTEGER", "CHECK >= 0, NOT NULL", "Current available physical stock balance in warehouse."],
    ["Materials", "ReorderLevel", "INTEGER", "CHECK >= 0, NOT NULL", "Minimum threshold quantity triggering restocking alert."],
    ["Work_Logs", "LogID", "INTEGER", "PK, AUTO_INCREMENT", "Unique identifier for daily repair work log."],
    ["Work_Logs", "AssignmentID", "INTEGER", "FK, NOT NULL", "References Assignments.AssignmentID."],
    ["Work_Logs", "HoursSpent", "DECIMAL(4,2)", "CHECK > 0 AND <= 24", "Labor hours dedicated to repair task."],
    ["Costs", "CostID", "INTEGER", "PK, AUTO_INCREMENT", "Unique ledger transaction entry for maintenance costs."],
    ["Costs", "Amount", "DECIMAL(10,2)", "CHECK >= 0, NOT NULL", "Financial monetary value incurred in INR (₹)."],
    ["Feedback", "Rating", "INTEGER", "CHECK >= 1 AND <= 5", "Requester evaluation score from 1 (poor) to 5 (excellent)."]
]

# Table 9: Database Implementation Environment
TABLE_9_DB_ENV = [
    ["Item", "Details"],
    ["DBMS", "SQLite 3.x / MySQL 8.0 Compatible Relational Engine"],
    ["DBMS Version", "SQLite 3.45.1 / MySQL 8.0.36 Community Edition"],
    ["Number of Tables", "15 Normalized Relational Tables + 1 Stored Analytical View (v_FacilityHealthDashboard)"],
    ["Sample Data", "85+ pre-populated realistic campus operational records across 5 academic blocks, 10 rooms, 10 assets, 5 technicians, 10 maintenance requests, 15 work logs, 10 spare parts, and 8 feedback ratings."]
]

# Table 10: Application Development Environment
TABLE_10_APP_ENV = [
    ["Item", "Details"],
    ["Programming Language", "TypeScript / JavaScript (Node.js runtime v20.17.0) & Python reference scripts"],
    ["DBMS", "SQLite 3 / MySQL 8.0 Relational RDBMS"],
    ["IDE / Framework / GUI Toolkit", "Next.js 14 App Router, React 18, Custom CSS Design System, VS Code IDE"],
    ["Database Connector / Driver", "Prisma ORM v5.21.1 (Type-Safe Query Engine & Schema Generator)"],
    ["Operating Environment", "Windows 11 64-bit OS, Google Chrome 129+, Microsoft Edge"],
    ["Repository Link", GITHUB_REPO]
]

# Table 11: Application Module-to-Database Mapping
TABLE_11_MODULE_MAP = [
    ["Module / Screen", "Purpose", "Tables Used", "Main Operations"],
    ["Executive KPI Dashboard", "Visualizes real-time incident metrics, active tickets, total expenditures, and low inventory alerts.", "Requests, Buildings, Rooms, Costs, Materials, Feedback, v_FacilityHealthDashboard", "SELECT aggregate counts, SUM(Amount) group by building, low-stock threshold queries."],
    ["Request Management Console", "Provides comprehensive incident roster with keyword search, building filters, status tabs, edit, and deletion.", "Requests, Users, Rooms, Buildings, Priority, Categories, Technicians, Assignments", "SELECT joined multi-table dataset, UPDATE request attributes, DELETE request with cascading cleanup."],
    ["Complaint Logging Portal", "Enables students and faculty to submit new maintenance issues with room, asset, and priority triage.", "Requests, Users, Rooms, Assets, Priority, Categories", "INSERT INTO Requests with auto-generated tracking code, input validation, and initial status 'Open'."],
    ["Technician Service Console", "Supervises technician roster, specializations, contact information, and active assignment dispatching.", "Technicians, Assignments, Requests, Work_Logs", "SELECT technician workload count, INSERT INTO Assignments, UPDATE technician availability."],
    ["Spare Parts Inventory", "Maintains replacement parts catalog, stock levels, unit costs, and replenishment triggers.", "Materials, Request_Materials", "SELECT material inventory, UPDATE stock quantities, INSERT new spare parts, DELETE obsolete items."],
    ["Work Log & Material Usage", "Records labor hours spent and decrements consumed spare parts atomically upon repair sign-off.", "Work_Logs, Request_Materials, Costs, Materials, Requests", "INSERT INTO Work_Logs, INSERT INTO Request_Materials, UPDATE Materials stock atomically, INSERT costs."],
    ["Quality Feedback & Review", "Captures user CSAT ratings and text comments upon ticket completion to compute average quality score.", "Feedback, Requests", "INSERT INTO Feedback (Rating, Comments), SELECT AVG(Rating) aggregated in dashboard."]
]

# Table 12: CRUD Operations
TABLE_12_CRUD = [
    ["Operation", "Application Feature / Screen", "Table(s) Affected", "Evidence"],
    ["Create", "Complaint Logging Modal; Technician Dispatch Dialog; New Spare Part Form", "Requests, Assignments, Materials, Work_Logs, Costs, Feedback", "INSERT INTO Requests creates new ticket REQ-2026-0010; INSERT INTO Assignments dispatches technician; INSERT INTO Materials registers new stock items."],
    ["Read / Search", "Request Table; Dynamic Search Bar; Status and Building Dropdown Filters", "Requests, Buildings, Rooms, Assets, Users, Priority, Technicians, Materials", "SELECT query with parameterized multi-table joins, ILIKE search strings, and filter conditions returning instant sub-5ms results."],
    ["Update", "Edit Request Modal; Edit Technician Dialog; Adjust Stock Dialog; Work Log Closure", "Requests, Technicians, Materials, Assignments", "UPDATE Requests SET PriorityID=?, Description=?; UPDATE Materials SET QuantityInStock=QuantityInStock-?; status transitions from Open -> Assigned -> Completed."],
    ["Delete / Controlled Removal", "Delete Request Button; Delete Technician Action; Delete Spare Part Dialog", "Requests, Status_History, Assignments, Technicians, Materials", "DELETE FROM Requests WHERE RequestID=? triggers safe referential removal or cascading cleanup of associated status logs."]
]

# Table 13: Business Rules, Validation and Error Handling
TABLE_13_RULES = [
    ["Rule / Validation", "How Implemented", "Evidence / Message"],
    ["BR-01: Unique Sequential Request Tracking Code", "Database UNIQUE constraint on RequestCode; application autogenerates sequential REQ-YYYY-NNNN format.", "Duplicate codes rejected by database unique index; generated code displayed upon creation."],
    ["BR-02: Technician Workload Threshold (Max 3 Jobs)", "Application verifies COUNT(active assignments) < 3 prior to dispatching new maintenance job to technician.", "Dialog alert: 'Technician has reached maximum active assignments (3/3). Please allocate another specialist.'"],
    ["BR-03: Strict Status Lifecycle State Machine", "Enforced at API and database layer: Open -> Assigned -> In Progress -> Completed / Cancelled. Direct bypass blocked.", "API returns 400 Bad Request if illegal transition attempted (e.g. attempting to close unassigned ticket)."],
    ["BR-04: Non-negative Inventory and Monetary Amounts", "Database CHECK (QuantityInStock >= 0) and CHECK (Amount >= 0); UI validation restricts numeric inputs.", "Attempting to consume 15 units when stock is 4 throws: 'Insufficient inventory stock available.'"],
    ["BR-05: Realistic Labor Hours Bounds", "Database CHECK (HoursSpent > 0.0 AND HoursSpent <= 24.0); form validation enforces step 0.25h increments.", "Input validation rejects zero, negative, or excessive values (>24h per single log entry)."],
    ["BR-06: SQL Injection & Parameter Sanitization", "All database transactions execute through Prisma ORM parameterized queries with strict TypeScript type contracts.", "Malformed input containing SQL injection payloads (e.g. ' OR '1'='1) sanitized safely as literal string."]
]

# Table 14: Reports and Database Operations
TABLE_14_REPORTS = [
    ["Report / Operation", "SQL / Database Concept Used", "Application Output"],
    ["Pending Incident Backlog by Urgency", "JOIN Requests with Priority; GROUP BY LevelName; ORDER BY ResponseTime ASC", "Categorized queue showing Emergency, High, Medium, and Low ticket counts with SLA timers."],
    ["Campus Building Maintenance Expenditure", "JOIN Buildings, Rooms, Requests, Costs; GROUP BY Buildings.Name; SUM(Amount)", "Building expenditure cards displaying total spent per block (e.g., Academic Block A: ₹1,385)."],
    ["Technician Workload & Performance Distribution", "LEFT JOIN Technicians with Assignments and Requests; COUNT(CASE WHEN Status='Completed'...) GROUP BY TechID", "Technician console cards displaying current active load (e.g., 2/3 active) and lifetime completed tasks."],
    ["Spare Parts Inventory Deficit & Restock Alerts", "SELECT * FROM Materials WHERE QuantityInStock <= ReorderLevel ORDER BY QuantityInStock ASC", "Prominent warning badges in dashboard: '2.5uF Fan Capacitor (1 left, threshold 5)'."],
    ["Customer Satisfaction (CSAT) Quality Index", "SELECT AVG(Rating) AS CSAT, COUNT(*) AS TotalReviews FROM Feedback", "Executive KPI score showing overall satisfaction score (4.8 ★ out of 5.0)."]
]

# Table 15: Test Cases
TABLE_15_TESTS = [
    ["Test ID", "Feature", "Input / Action", "Expected Result", "Actual Result", "Status"],
    ["TC-01", "Log New Maintenance Request (Positive)", "Enter Room: CS-LAB-301, Asset: Precision AC, Priority: Emergency, Desc: Tripping breaker.", "Ticket created with code REQ-2026-0009, initial status 'Open', displayed in request table.", "Ticket REQ-2026-0009 successfully created in database with status 'Open'.", "Pass"],
    ["TC-02", "Form Validation on Empty Description (Negative)", "Submit request form with empty description and unselected room.", "Form submission prevented; error message highlights missing mandatory fields.", "UI displays validation warning; no record inserted into database.", "Pass"],
    ["TC-03", "Assign Technician within Load Capacity (Positive)", "Assign open ticket to Priya Patel (Plumbing specialist, current active count: 1).", "Assignment record inserted; ticket status changes to 'Assigned'; technician active load increments to 2/3.", "Assignment created; ticket reflects 'Assigned to Priya Patel'; load updated to 2/3.", "Pass"],
    ["TC-04", "Enforce Technician Workload Cap (Negative)", "Attempt to dispatch 4th active ticket to technician already having 3 active jobs.", "System blocks assignment and prompts supervisor that technician is at maximum capacity (3/3).", "Assignment rejected with alert: 'Technician has reached maximum active assignments (3/3)'.", "Pass"],
    ["TC-05", "Record Work Log & Deduct Spare Stock (Positive)", "Technician logs 1.5 hours worked and consumes 2 units of 'LED Tube Light 20W' (initial stock: 6).", "Work log recorded; inventory stock decremented from 6 to 4; cost entry of ₹360 recorded.", "Work log saved; inventory stock reduced to 4; cost ledger updated; status changed to 'Completed'.", "Pass"],
    ["TC-06", "Prevent Negative Inventory Stock Consumption (Negative)", "Attempt to consume 25 units of Fan Capacitors when available stock is 1 unit.", "Transaction blocked; error dialog warns that inventory quantity is insufficient.", "Transaction aborted; stock remains 1 unit; no negative quantity allowed.", "Pass"],
    ["TC-07", "Submit Requester CSAT Feedback (Positive)", "Requester rates 5 stars with comment 'AC cooling restored swiftly' on closed ticket.", "Feedback record inserted; overall campus CSAT score dynamically recalculated on dashboard.", "Feedback inserted into database; dashboard updates CSAT rating to 4.8 ★.", "Pass"]
]

# IEEE References
REFERENCES = [
    "[1] A. Silberschatz, H. F. Korth, and S. Sudarshan, Database System Concepts, 7th ed. New York, NY, USA: McGraw-Hill Education, 2020.",
    "[2] R. Elmasri and S. B. Navathe, Fundamentals of Database Systems, 7th ed. Boston, MA, USA: Pearson, 2017.",
    "[3] C. J. Date, An Introduction to Database Systems, 8th ed. Boston, MA, USA: Addison-Wesley, 2004.",
    "[4] M. Kleppmann, Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems, 1st ed. Sebastopol, CA, USA: O'Reilly Media, 2017.",
    "[5] Prisma Documentation, \"Prisma ORM Architecture and Type-Safe Database Modeling,\" Prisma Data, Inc., 2026. [Online]. Available: https://www.prisma.io/docs",
    "[6] Next.js Documentation, \"Next.js App Router and Server Components Architecture,\" Vercel, Inc., 2026. [Online]. Available: https://nextjs.org/docs"
]

print("report_data.py initialized successfully.")
