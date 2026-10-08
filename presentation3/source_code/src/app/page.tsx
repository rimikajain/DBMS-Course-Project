"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  PlusCircle,
  BarChart3,
  Package,
  Star,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  XCircle,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Coins,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function FacilityManagementApp() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "requests" | "create" | "technician" | "inventory"
  >("dashboard");

  // Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [buildingFilter, setBuildingFilter] = useState("");

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [assignModalReq, setAssignModalReq] = useState<any>(null);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [workLogModalReq, setWorkLogModalReq] = useState<any>(null);
  const [feedbackModalReq, setFeedbackModalReq] = useState<any>(null);

  // Form states for Create Request
  const [formBuildingId, setFormBuildingId] = useState("");
  const [formRoomId, setFormRoomId] = useState("");
  const [formAssetId, setFormAssetId] = useState("");
  const [formUserId, setFormUserId] = useState("");
  const [formPriorityId, setFormPriorityId] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Form states for Work Log
  const [wlHours, setWlHours] = useState("2.0");
  const [wlDesc, setWlDesc] = useState("");
  const [wlMaterialId, setWlMaterialId] = useState("");
  const [wlQty, setWlQty] = useState("1");

  // Form states for Feedback
  const [fbRating, setFbRating] = useState(5);
  const [fbComments, setFbComments] = useState("");

  // Alerts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, metaRes, reqRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/metadata"),
        fetch(`/api/requests?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}&buildingId=${buildingFilter}`),
      ]);

      const [dashJson, metaJson, reqJson] = await Promise.all([
        dashRes.json(),
        metaRes.json(),
        reqRes.json(),
      ]);

      if (dashJson.success) setDashboardData(dashJson.data);
      if (metaJson.success) setMetadata(metaJson.data);
      if (reqJson.success) setRequests(reqJson.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to connect to database API", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, buildingFilter]);

  // Handle Search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/requests?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}&buildingId=${buildingFilter}`
      );
      const json = await res.json();
      if (json.success) setRequests(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit New Request (CREATE)
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUserId || !formRoomId || !formPriorityId || !formDescription.trim()) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: formUserId,
          roomId: formRoomId,
          assetId: formAssetId || null,
          priorityId: formPriorityId,
          description: formDescription,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast(`Request ${json.data.requestCode} registered successfully!`);
        setFormDescription("");
        setFormAssetId("");
        setActiveTab("requests");
        fetchData();
      } else {
        showToast(json.error || "Failed to create request", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Assign Technician (UPDATE)
  const handleAssignTechnician = async () => {
    if (!selectedTechId || !assignModalReq) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/requests/${assignModalReq.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ techId: selectedTechId }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Technician assigned successfully!");
        setAssignModalReq(null);
        setSelectedTechId("");
        fetchData();
      } else {
        showToast(json.error || "Assignment failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Work Log & Materials (UPDATE / TRANSACTION)
  const handleWorkLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workLogModalReq || !wlDesc.trim()) {
      showToast("Work description is required", "error");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/requests/${workLogModalReq.id}/worklog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoursSpent: wlHours,
          description: wlDesc,
          materialId: wlMaterialId || null,
          quantityUsed: wlMaterialId ? wlQty : null,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Work log submitted and ticket marked Completed!");
        setWorkLogModalReq(null);
        setWlDesc("");
        setWlMaterialId("");
        fetchData();
      } else {
        showToast(json.error || "Failed to log work", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalReq) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/requests/${feedbackModalReq.id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: fbRating,
          comments: fbComments,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Feedback submitted. Thank you!");
        setFeedbackModalReq(null);
        setFbComments("");
        fetchData();
      } else {
        showToast(json.error || "Failed to submit feedback", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Request (DELETE / SOFT CANCEL)
  const handleCancelRequest = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this maintenance request?")) return;

    try {
      const res = await fetch(`/api/requests/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by requester." }),
      });
      const json = await res.json();
      if (json.success) {
        showToast("Request cancelled successfully.");
        fetchData();
      } else {
        showToast(json.error || "Cancellation failed", "error");
      }
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <span className="badge badge-open"><Clock size={11} /> Open</span>;
      case "Assigned":
        return <span className="badge badge-assigned"><UserCheck size={11} /> Assigned</span>;
      case "In Progress":
        return <span className="badge badge-progress"><Wrench size={11} /> In Progress</span>;
      case "Completed":
        return <span className="badge badge-completed"><CheckCircle2 size={11} /> Completed</span>;
      case "Cancelled":
        return <span className="badge badge-cancelled"><XCircle size={11} /> Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priorityName: string) => {
    switch (priorityName) {
      case "Emergency":
        return <span className="badge badge-emergency"><ShieldAlert size={11} /> Emergency</span>;
      case "High":
        return <span className="badge badge-high"><AlertTriangle size={11} /> High</span>;
      case "Medium":
        return <span className="badge badge-medium">Medium</span>;
      case "Low":
        return <span className="badge badge-low">Low</span>;
      default:
        return <span className="badge">{priorityName}</span>;
    }
  };

  // Filtered rooms for create request form
  const availableRooms = metadata?.rooms?.filter(
    (r: any) => !formBuildingId || r.buildingId === parseInt(formBuildingId, 10)
  ) || [];

  const selectedRoomObj = metadata?.rooms?.find(
    (r: any) => r.id === parseInt(formRoomId, 10)
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            background: toastMessage.type === "success" ? "var(--bg-surface)" : "#271216",
            border: `1px solid ${toastMessage.type === "success" ? "var(--pastel-sage-border)" : "var(--pastel-rose-border)"}`,
            color: toastMessage.type === "success" ? "var(--pastel-sage)" : "var(--pastel-rose)",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            fontSize: "13.5px",
            fontWeight: 600,
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          className="animate-fade-in"
        >
          {toastMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {toastMessage.text}
        </div>
      )}

      {/* TOP HEADER */}
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(10, 10, 13, 0.9)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "var(--pastel-peach-bg)",
                border: "1px solid var(--pastel-peach-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--pastel-peach)",
              }}
            >
              <Wrench size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h1 style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "-0.2px" }}>
                  Campus Facility Maintenance System
                </h1>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "1px" }}>
                Woxsen University · Rimika Jain (25WU0101111) · AIMLRhinos'29
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "9999px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--pastel-sage)",
                  boxShadow: "0 0 8px var(--pastel-sage)",
                }}
              />
              Operational Status: Active
            </div>

            <button
              onClick={() => {
                fetchData();
                showToast("System refreshed with live database data");
              }}
              className="btn btn-secondary"
              style={{ padding: "6px 12px", fontSize: "12px" }}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
            {[
              { id: "dashboard", label: "Overview Dashboard", icon: BarChart3 },
              { id: "requests", label: "Request Management", icon: FileText },
              { id: "create", label: "Log New Request", icon: PlusCircle },
              { id: "technician", label: "Technician Console", icon: Wrench },
              { id: "inventory", label: "Spare Parts Inventory", icon: Package },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${isActive ? "var(--pastel-peach)" : "transparent"}`,
                    color: isActive ? "var(--pastel-peach)" : "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "28px 24px", flex: 1, width: "100%" }}>
        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* KPI STATS ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  label: "Total Incidents",
                  value: dashboardData?.kpis?.totalRequests ?? "-",
                  sub: "All campus blocks",
                  color: "var(--text-main)",
                  bg: "var(--bg-card)",
                },
                {
                  label: "Pending Backlog",
                  value: dashboardData?.kpis?.pendingRequests ?? "-",
                  sub: "Open & Assigned",
                  color: "var(--pastel-butter)",
                  bg: "var(--pastel-butter-bg)",
                  border: "var(--pastel-butter-border)",
                },
                {
                  label: "Active In Progress",
                  value: dashboardData?.kpis?.activeRequests ?? "-",
                  sub: "Technicians on-site",
                  color: "var(--pastel-peach)",
                  bg: "var(--pastel-peach-bg)",
                  border: "var(--pastel-peach-border)",
                },
                {
                  label: "Resolved & Closed",
                  value: dashboardData?.kpis?.completedRequests ?? "-",
                  sub: "Turnaround sign-offs",
                  color: "var(--pastel-sage)",
                  bg: "var(--pastel-sage-bg)",
                  border: "var(--pastel-sage-border)",
                },
                {
                  label: "Total Maintenance Cost",
                  value: `₹${(dashboardData?.kpis?.totalExpenditure ?? 0).toLocaleString()}`,
                  sub: "Materials + Labor",
                  color: "var(--pastel-sky)",
                  bg: "var(--pastel-sky-bg)",
                  border: "var(--pastel-sky-border)",
                },
                {
                  label: "CSAT User Rating",
                  value: `${dashboardData?.kpis?.avgRating ?? "5.0"} ★`,
                  sub: "Out of 5.0 scale",
                  color: "var(--pastel-butter)",
                  bg: "var(--bg-card)",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="dark-card"
                  style={{
                    background: stat.bg,
                    border: stat.border ? `1px solid ${stat.border}` : "1px solid var(--border-subtle)",
                    padding: "18px 20px",
                  }}
                >
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>{stat.label}</p>
                  <p style={{ fontSize: "26px", fontWeight: 800, color: stat.color, margin: "6px 0 2px" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* SPLIT ROW: Building Load Breakdown & Low Stock Warnings */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px" }}>
              {/* Campus Blocks Health Matrix */}
              <div className="dark-card">
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Campus Blocks Maintenance Load</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Building-wise breakdown of logged tickets and accumulated expenditure
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {dashboardData?.buildingStats?.map((b: any) => (
                    <div
                      key={b.id}
                      style={{
                        padding: "12px 16px",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--pastel-peach)",
                          }}
                        >
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "13.5px" }}>{b.name}</p>
                          <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{b.location}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "24px", textAlign: "right" }}>
                        <div>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Tickets</p>
                          <p style={{ fontSize: "13.5px", fontWeight: 700 }}>
                            {b.totalRequests} <span style={{ fontSize: "11px", color: "var(--pastel-peach)" }}>({b.activeRequests} active)</span>
                          </p>
                        </div>
                        <div style={{ minWidth: "90px" }}>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Expenditure</p>
                          <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--pastel-sage)" }}>
                            ₹{b.totalCost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Inventory & Materials Warnings */}
              <div className="dark-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Spare Inventory Alerts</h3>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Items below threshold reorder level</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="btn btn-secondary"
                    style={{ fontSize: "11.5px", padding: "5px 10px" }}
                  >
                    Inventory <ChevronRight size={13} />
                  </button>
                </div>

                {dashboardData?.lowStockMaterials?.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)", fontSize: "13px" }}>
                    <CheckCircle2 size={32} style={{ color: "var(--pastel-sage)", margin: "0 auto 8px" }} />
                    All inventory stocks are within safe levels.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {dashboardData?.lowStockMaterials?.map((m: any) => (
                      <div
                        key={m.id}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "var(--radius-md)",
                          background: "var(--pastel-rose-bg)",
                          border: "1px solid var(--pastel-rose-border)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-main)" }}>
                            {m.materialName}
                          </p>
                          <p style={{ fontSize: "11px", color: "var(--pastel-rose)" }}>
                            Reorder Threshold: {m.reorderLevel} units | Unit: ₹{m.unitCost}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              background: "rgba(244, 114, 182, 0.25)",
                              color: "var(--pastel-rose)",
                              padding: "4px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {m.quantityInStock} Left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RECENT ACTIVITY FEED */}
            <div className="dark-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Recent Campus Maintenance Requests</h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Real-time feed of logged complaints</p>
                </div>
                <button
                  onClick={() => setActiveTab("requests")}
                  className="btn btn-secondary"
                  style={{ fontSize: "11.5px", padding: "5px 10px" }}
                >
                  View All Requests <ChevronRight size={13} />
                </button>
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tracking Code</th>
                      <th>Location</th>
                      <th>Requester</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Problem Summary</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData?.recentRequests?.map((r: any) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700, color: "var(--pastel-peach)" }}>{r.requestCode}</td>
                        <td>
                          {r.room?.building?.buildingName} - {r.room?.roomNumber}
                        </td>
                        <td>{r.user?.fullName}</td>
                        <td>{getPriorityBadge(r.priority?.levelName)}</td>
                        <td>{getStatusBadge(r.currentStatus)}</td>
                        <td style={{ maxWidth: "320px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.description}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setSelectedRequest(r);
                            }}
                            className="btn btn-secondary"
                            style={{ padding: "4px 10px", fontSize: "11.5px" }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REQUEST MANAGEMENT GRID */}
        {/* ========================================================================= */}
        {activeTab === "requests" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Control Bar: Search & Filters */}
            <div
              className="dark-card"
              style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}
            >
              <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flex: "1 1 300px" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <Search
                    size={16}
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    placeholder="Search by code, room, building, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
                <button type="submit" className="btn btn-secondary">
                  Search
                </button>
              </form>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                  style={{ width: "auto" }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={buildingFilter}
                  onChange={(e) => setBuildingFilter(e.target.value)}
                  className="input-field"
                  style={{ width: "auto" }}
                >
                  <option value="">All Buildings</option>
                  {metadata?.buildings?.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.buildingName}
                    </option>
                  ))}
                </select>

                <button onClick={() => setActiveTab("create")} className="btn btn-primary">
                  <PlusCircle size={15} /> Log Complaint
                </button>
              </div>
            </div>

            {/* REQUESTS TABLE */}
            <div className="dark-card" style={{ padding: "0" }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tracking Code</th>
                      <th>Location</th>
                      <th>Asset</th>
                      <th>Requester</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Date Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                          No maintenance requests found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      requests.map((r) => {
                        const activeAssignment = r.assignments?.find(
                          (a: any) => a.status === "Assigned" || a.status === "In Progress"
                        );
                        return (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 700, color: "var(--pastel-peach)" }}>{r.requestCode}</td>
                            <td>
                              <span style={{ fontWeight: 600 }}>{r.room?.building?.buildingName}</span>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Room {r.room?.roomNumber}</div>
                            </td>
                            <td>
                              {r.asset ? (
                                <div>
                                  <span style={{ fontSize: "12px" }}>{r.asset.assetName}</span>
                                  <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{r.asset.serialNumber}</div>
                                </div>
                              ) : (
                                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>General Room</span>
                              )}
                            </td>
                            <td>
                              <span style={{ fontSize: "12.5px" }}>{r.user?.fullName}</span>
                              <div style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>{r.user?.role}</div>
                            </td>
                            <td>{getPriorityBadge(r.priority?.levelName)}</td>
                            <td>{getStatusBadge(r.currentStatus)}</td>
                            <td>
                              {activeAssignment ? (
                                <span style={{ fontSize: "12.5px", color: "var(--pastel-sky)" }}>
                                  {activeAssignment.technician?.user?.fullName}
                                </span>
                              ) : (
                                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Unassigned</span>
                              )}
                            </td>
                            <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {new Date(r.dateSubmitted).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => setSelectedRequest(r)}
                                  className="btn btn-secondary"
                                  style={{ padding: "4px 8px", fontSize: "11.5px" }}
                                >
                                  View
                                </button>

                                {r.currentStatus === "Open" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setAssignModalReq(r);
                                        setSelectedTechId("");
                                      }}
                                      className="btn btn-primary"
                                      style={{ padding: "4px 8px", fontSize: "11.5px" }}
                                    >
                                      Dispatch
                                    </button>
                                    <button
                                      onClick={() => handleCancelRequest(r.id)}
                                      className="btn btn-danger"
                                      style={{ padding: "4px 8px", fontSize: "11.5px" }}
                                      title="Cancel Ticket"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}

                                {(r.currentStatus === "Assigned" || r.currentStatus === "In Progress") && (
                                  <button
                                    onClick={() => {
                                      setWorkLogModalReq(r);
                                      setWlDesc("");
                                    }}
                                    className="btn btn-success"
                                    style={{ padding: "4px 8px", fontSize: "11.5px" }}
                                  >
                                    Work Log
                                  </button>
                                )}

                                {r.currentStatus === "Completed" && !r.feedback && (
                                  <button
                                    onClick={() => {
                                      setFeedbackModalReq(r);
                                      setFbRating(5);
                                      setFbComments("");
                                    }}
                                    className="btn btn-secondary"
                                    style={{ padding: "4px 8px", fontSize: "11.5px", color: "var(--pastel-butter)" }}
                                  >
                                    Rate ★
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LOG NEW REQUEST (CREATE FORM) */}
        {/* ========================================================================= */}
        {activeTab === "create" && (
          <div className="animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="dark-card">
              <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "16px", marginBottom: "22px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px" }}>
                  <PlusCircle size={20} style={{ color: "var(--pastel-peach)" }} />
                  Submit Campus Facility Maintenance Request
                </h2>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Registered complaint will be normalized, assigned a unique tracking number, and routed based on SLA priority.
                </p>
              </div>

              <form onSubmit={handleCreateRequest} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Requester Select */}
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                    Select Requester (Student / Faculty / Staff) *
                  </label>
                  <select
                    value={formUserId}
                    onChange={(e) => setFormUserId(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">-- Choose User --</option>
                    {metadata?.users?.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role} - {u.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Building & Room Selectors (Cascading) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                      Campus Building *
                    </label>
                    <select
                      value={formBuildingId}
                      onChange={(e) => {
                        setFormBuildingId(e.target.value);
                        setFormRoomId("");
                        setFormAssetId("");
                      }}
                      className="input-field"
                      required
                    >
                      <option value="">-- Choose Building --</option>
                      {metadata?.buildings?.map((b: any) => (
                        <option key={b.id} value={b.id}>
                          {b.buildingName} ({b.campusLocation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                      Room Location *
                    </label>
                    <select
                      value={formRoomId}
                      onChange={(e) => {
                        setFormRoomId(e.target.value);
                        setFormAssetId("");
                      }}
                      className="input-field"
                      disabled={!formBuildingId}
                      required
                    >
                      <option value="">-- Choose Room --</option>
                      {availableRooms.map((r: any) => (
                        <option key={r.id} value={r.id}>
                          Room {r.roomNumber} (Floor {r.floorLevel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specific Asset Tagging (Optional) */}
                {selectedRoomObj && selectedRoomObj.assets?.length > 0 && (
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                      Specific Equipment / Asset Tag (Optional)
                    </label>
                    <select
                      value={formAssetId}
                      onChange={(e) => setFormAssetId(e.target.value)}
                      className="input-field"
                    >
                      <option value="">-- General Room Issue (No Specific Asset) --</option>
                      {selectedRoomObj.assets.map((a: any) => (
                        <option key={a.id} value={a.id}>
                          {a.assetName} [S/N: {a.serialNumber}] ({a.category.categoryName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Priority Selection with Visual SLA Cards */}
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "8px" }}>
                    Urgency & Service Level Agreement (Priority) *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
                    {metadata?.priorities?.map((p: any) => {
                      const isSelected = formPriorityId === String(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => setFormPriorityId(String(p.id))}
                          style={{
                            padding: "12px",
                            borderRadius: "var(--radius-md)",
                            background: isSelected ? "var(--bg-card-hover)" : "var(--bg-surface)",
                            border: `1px solid ${isSelected ? "var(--pastel-peach)" : "var(--border-subtle)"}`,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p style={{ fontWeight: 700, fontSize: "13px", color: isSelected ? "var(--pastel-peach)" : "var(--text-main)" }}>
                              {p.levelName}
                            </p>
                            {isSelected && <CheckCircle2 size={15} style={{ color: "var(--pastel-peach)" }} />}
                          </div>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                            Target SLA: {p.responseTimeHours} Hours
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                    Problem Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the defect, symptoms (e.g. rattling sound, circuit breaker tripping, water leakage)..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("requests")}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="btn btn-primary"
                    style={{ minWidth: "160px" }}
                  >
                    {actionLoading ? "Registering..." : "Submit Complaint"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TECHNICIAN CONSOLE */}
        {/* ========================================================================= */}
        {activeTab === "technician" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="dark-card">
              <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>Technician Service Console</h2>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                Active maintenance assignments requiring on-site diagnostics, material replacements, and sign-offs.
              </p>
            </div>

            {/* Technician Roster with Active Load */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {metadata?.technicians?.map((t: any) => {
                const activeCount = t.assignments?.length || 0;
                return (
                  <div key={t.id} className="dark-card" style={{ padding: "16px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h4 style={{ fontSize: "14px", fontWeight: 700 }}>{t.user.fullName}</h4>
                        <p style={{ fontSize: "12px", color: "var(--pastel-peach)", fontWeight: 600 }}>{t.specialization}</p>
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: t.availabilityStatus === "Available" ? "var(--pastel-sage-bg)" : "var(--pastel-rose-bg)",
                          color: t.availabilityStatus === "Available" ? "var(--pastel-sage)" : "var(--pastel-rose)",
                          borderColor: t.availabilityStatus === "Available" ? "var(--pastel-sage-border)" : "var(--pastel-rose-border)",
                        }}
                      >
                        {t.availabilityStatus}
                      </span>
                    </div>

                    <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", fontSize: "12px", borderTop: "1px solid var(--border-subtle)", paddingTop: "10px" }}>
                      <span style={{ color: "var(--text-muted)" }}>Active Work Orders:</span>
                      <span style={{ fontWeight: 700 }}>{activeCount} / 3 Max</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assigned Tickets Awaiting Work Entry */}
            <div className="dark-card" style={{ padding: "0" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Active Jobs Ready for Work Log & Closure</h3>
              </div>
              <div className="data-table-container" style={{ border: "none" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Request Code</th>
                      <th>Location</th>
                      <th>Assigned Technician</th>
                      <th>Specialization</th>
                      <th>Issue Description</th>
                      <th>Priority</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.filter((r) => r.currentStatus === "Assigned" || r.currentStatus === "In Progress").length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)" }}>
                          No active assigned tasks right now.
                        </td>
                      </tr>
                    ) : (
                      requests
                        .filter((r) => r.currentStatus === "Assigned" || r.currentStatus === "In Progress")
                        .map((r) => {
                          const asg = r.assignments?.[0];
                          return (
                            <tr key={r.id}>
                              <td style={{ fontWeight: 700, color: "var(--pastel-peach)" }}>{r.requestCode}</td>
                              <td>{r.room?.building?.buildingName} - {r.room?.roomNumber}</td>
                              <td style={{ fontWeight: 600 }}>{asg?.technician?.user?.fullName}</td>
                              <td><span className="badge badge-assigned">{asg?.technician?.specialization}</span></td>
                              <td style={{ maxWidth: "300px" }}>{r.description}</td>
                              <td>{getPriorityBadge(r.priority?.levelName)}</td>
                              <td>
                                <button
                                  onClick={() => {
                                    setWorkLogModalReq(r);
                                    setWlDesc("");
                                  }}
                                  className="btn btn-primary"
                                  style={{ padding: "5px 12px", fontSize: "12px" }}
                                >
                                  Complete Job & Log Parts
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SPARE PARTS INVENTORY */}
        {/* ========================================================================= */}
        {activeTab === "inventory" && (
          <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="dark-card">
              <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>Facility Spare Parts Inventory</h2>
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                Stock records, replenishment thresholds, and automated deficit alerts.
              </p>
            </div>

            <div className="dark-card" style={{ padding: "0" }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Material Item</th>
                      <th>Unit Cost (₹)</th>
                      <th>Current Stock</th>
                      <th>Reorder Threshold</th>
                      <th>Inventory Status</th>
                      <th>Stock Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metadata?.materials?.map((m: any) => {
                      const isDeficit = m.quantityInStock <= m.reorderLevel;
                      return (
                        <tr key={m.id}>
                          <td style={{ fontWeight: 600, fontSize: "13.5px" }}>{m.materialName}</td>
                          <td>₹{m.unitCost.toFixed(2)}</td>
                          <td style={{ fontWeight: 700 }}>
                            <span style={{ color: isDeficit ? "var(--pastel-rose)" : "var(--text-main)" }}>
                              {m.quantityInStock} Units
                            </span>
                          </td>
                          <td style={{ color: "var(--text-muted)" }}>{m.reorderLevel} Units</td>
                          <td>
                            {isDeficit ? (
                              <span className="badge badge-emergency">REORDER REQUIRED</span>
                            ) : (
                              <span className="badge badge-low">SUFFICIENT</span>
                            )}
                          </td>
                          <td style={{ fontWeight: 600, color: "var(--pastel-sage)" }}>
                            ₹{(m.quantityInStock * m.unitCost).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: TICKET DETAIL & AUDIT TIMELINE */}
      {/* ========================================================================= */}
      {selectedRequest && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          className="animate-fade-in"
        >
          <div
            className="dark-card"
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--pastel-peach)" }}>
                    {selectedRequest.requestCode}
                  </h3>
                  {getStatusBadge(selectedRequest.currentStatus)}
                  {getPriorityBadge(selectedRequest.priority?.levelName)}
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                  Filed by {selectedRequest.user?.fullName} ({selectedRequest.user?.role} - {selectedRequest.user?.department})
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="btn btn-secondary"
                style={{ padding: "6px 10px" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Location & Asset Box */}
              <div style={{ background: "var(--bg-surface)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>Location & Asset</h4>
                <p style={{ fontWeight: 600, fontSize: "13.5px" }}>
                  {selectedRequest.room?.building?.buildingName} - Room {selectedRequest.room?.roomNumber} (Floor {selectedRequest.room?.floorLevel})
                </p>
                {selectedRequest.asset && (
                  <p style={{ fontSize: "12px", color: "var(--pastel-sky)", marginTop: "4px" }}>
                    Asset: {selectedRequest.asset.assetName} [S/N: {selectedRequest.asset.serialNumber}] ({selectedRequest.asset.category?.categoryName})
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Complaint Details</h4>
                <p style={{ fontSize: "13.5px", lineHeight: "1.6", background: "var(--bg-surface)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                  {selectedRequest.description}
                </p>
              </div>

              {/* Costs Breakdown (if any) */}
              {selectedRequest.costs?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>Cost Accounting Ledger</h4>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {selectedRequest.costs.map((c: any) => (
                      <div
                        key={c.id}
                        style={{
                          background: "var(--bg-surface)",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-subtle)",
                          flex: 1,
                        }}
                      >
                        <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.costType} Cost</p>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--pastel-sage)" }}>₹{c.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback (if any) */}
              {selectedRequest.feedback && (
                <div style={{ background: "var(--pastel-butter-bg)", border: "1px solid var(--pastel-butter-border)", padding: "12px", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "var(--pastel-butter)", fontWeight: 800 }}>★ {selectedRequest.feedback.rating} / 5</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Requester Feedback</span>
                  </div>
                  {selectedRequest.feedback.comments && (
                    <p style={{ fontSize: "12.5px", marginTop: "4px", fontStyle: "italic" }}>
                      "{selectedRequest.feedback.comments}"
                    </p>
                  )}
                </div>
              )}

              {/* Audit Trail Timeline */}
              <div>
                <h4 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                  Status History & Audit Trail
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedRequest.statusHistory?.map((h: any) => (
                    <div
                      key={h.id}
                      style={{
                        padding: "8px 12px",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: "3px solid var(--pastel-peach)",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600 }}>{h.previousStatus} → {h.newStatus}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                          {new Date(h.changedDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {h.remarks && <p style={{ color: "var(--text-secondary)", marginTop: "2px" }}>{h.remarks}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ASSIGN TECHNICIAN */}
      {/* ========================================================================= */}
      {assignModalReq && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          className="animate-fade-in"
        >
          <div className="dark-card" style={{ width: "100%", maxWidth: "500px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
              Dispatch Technician: {assignModalReq.requestCode}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "18px" }}>
              {assignModalReq.room?.building?.buildingName} - {assignModalReq.room?.roomNumber} | Priority: {assignModalReq.priority?.levelName}
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "8px" }}>
                Select Available Technician *
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {metadata?.technicians?.map((t: any) => {
                  const isSelected = selectedTechId === String(t.id);
                  const isBusy = t.assignments?.length >= 3;
                  return (
                    <div
                      key={t.id}
                      onClick={() => !isBusy && setSelectedTechId(String(t.id))}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? "var(--bg-card-hover)" : "var(--bg-surface)",
                        border: `1px solid ${isSelected ? "var(--pastel-peach)" : "var(--border-subtle)"}`,
                        opacity: isBusy ? 0.5 : 1,
                        cursor: isBusy ? "not-allowed" : "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "13px" }}>{t.user.fullName}</p>
                        <p style={{ fontSize: "11px", color: "var(--pastel-sky)" }}>{t.specialization}</p>
                      </div>
                      <span style={{ fontSize: "11.5px", color: isBusy ? "var(--pastel-rose)" : "var(--text-muted)" }}>
                        {isBusy ? "Capacity Full (3/3)" : `${t.assignments?.length || 0}/3 Active`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setAssignModalReq(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleAssignTechnician}
                disabled={!selectedTechId || actionLoading}
                className="btn btn-primary"
              >
                {actionLoading ? "Dispatching..." : "Confirm Dispatch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: WORK LOG & SPARE PARTS ENTRY */}
      {/* ========================================================================= */}
      {workLogModalReq && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          className="animate-fade-in"
        >
          <div className="dark-card" style={{ width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
              Record Service Log & Close Job: {workLogModalReq.requestCode}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "18px" }}>
              Work logs enforce labor duration validation, atomic inventory deduction, and auto-cost ledger posting.
            </p>

            <form onSubmit={handleWorkLogSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                  Labor Hours Spent (Validated 0.1 - 24.0 hrs) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="24"
                  value={wlHours}
                  onChange={(e) => setWlHours(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                  Diagnostic Summary / Action Taken *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail repairs made (e.g. replaced burnt capacitor, re-soldered connection, cleaned filters)..."
                  value={wlDesc}
                  onChange={(e) => setWlDesc(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Spare Parts Replacement */}
              <div style={{ background: "var(--bg-surface)", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "8px" }}>
                  Replacement Material from Stock (Optional)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                  <select
                    value={wlMaterialId}
                    onChange={(e) => setWlMaterialId(e.target.value)}
                    className="input-field"
                  >
                    <option value="">-- No Spare Parts Used --</option>
                    {metadata?.materials?.map((m: any) => (
                      <option key={m.id} value={m.id} disabled={m.quantityInStock <= 0}>
                        {m.materialName} ({m.quantityInStock} in stock | ₹{m.unitCost})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={wlQty}
                    onChange={(e) => setWlQty(e.target.value)}
                    className="input-field"
                    disabled={!wlMaterialId}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" onClick={() => setWorkLogModalReq(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-success">
                  {actionLoading ? "Processing..." : "Complete & Sign Off"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: FEEDBACK SUBMISSION */}
      {/* ========================================================================= */}
      {feedbackModalReq && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          className="animate-fade-in"
        >
          <div className="dark-card" style={{ width: "100%", maxWidth: "450px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
              Rate Facility Service: {feedbackModalReq.requestCode}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Your feedback is recorded directly to improve maintenance service quality.
            </p>

            <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "8px" }}>
                  Rating (1 to 5 Stars) *
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFbRating(star)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "var(--radius-md)",
                        background: fbRating >= star ? "var(--pastel-butter-bg)" : "var(--bg-surface)",
                        border: `1px solid ${fbRating >= star ? "var(--pastel-butter-border)" : "var(--border-subtle)"}`,
                        color: fbRating >= star ? "var(--pastel-butter)" : "var(--text-muted)",
                        fontSize: "14px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, marginBottom: "6px" }}>
                  Feedback Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share feedback on resolution speed, technician professionalism..."
                  value={fbComments}
                  onChange={(e) => setFbComments(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setFeedbackModalReq(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn btn-primary">
                  {actionLoading ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          padding: "16px 24px",
          background: "var(--bg-surface)",
          fontSize: "12px",
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div>
            Campus Facility Maintenance Request Management System | Woxsen University
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Author: Rimika Jain (25WU0101111)</span>
            <span>Batch: AIMLRhinos'29</span>
            <span style={{ color: "var(--pastel-peach)" }}>Enterprise Facility Operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
