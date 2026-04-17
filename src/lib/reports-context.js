"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

const ReportsContext = createContext(null);

// Channel name for cross-tab communication
const CHANNEL_NAME = "sidrain_reports_sync";

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const channelRef = useRef(null);

  // Load reports from API on mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports?perPage=100");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Initialize BroadcastChannel for cross-tab sync
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === "STATUS_UPDATE") {
          applyStatusUpdateLocal(payload);
        } else if (type === "NEW_REPORT") {
          applyNewReportLocal(payload);
        } else if (type === "REFRESH") {
          fetchReports();
        }
      };

      return () => channel.close();
    } catch (e) {
      // BroadcastChannel not supported
    }
  }, []);

  // Broadcast to other tabs
  const broadcast = useCallback((type, payload) => {
    try {
      channelRef.current?.postMessage({ type, payload });
    } catch (e) {}
  }, []);

  // Apply status update locally (from broadcast)
  const applyStatusUpdateLocal = useCallback((payload) => {
    const { reportId, newStatus, updatedAt } = payload;
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: newStatus, updated_at: updatedAt }
          : r
      )
    );
  }, []);

  // Apply new report locally (from broadcast)
  const applyNewReportLocal = useCallback((report) => {
    setReports((prev) => {
      if (prev.find((r) => r.id === report.id)) return prev;
      return [report, ...prev];
    });
  }, []);

  // Update report status via API (admin)
  const updateReportStatus = useCallback(
    async (reportId, newStatus, note = "", updatedBy = "Admin SiDrain") => {
      try {
        const res = await fetch(`/api/reports/${reportId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, note, updated_by: updatedBy }),
        });

        if (res.ok) {
          const data = await res.json();
          const updatedAt = data.report.updated_at;

          // Update local state
          setReports((prev) =>
            prev.map((r) =>
              r.id === reportId
                ? { ...r, status: newStatus, updated_at: updatedAt }
                : r
            )
          );

          // Add notification
          const statusMessages = {
            "Diverifikasi": "telah diverifikasi oleh admin",
            "Diproses": "sedang dalam proses penanganan",
            "Selesai": "telah selesai ditangani",
            "Ditolak": "telah ditolak oleh admin",
          };
          const msg = statusMessages[newStatus] || `status diperbarui ke ${newStatus}`;
          setNotifications((prev) => [
            {
              id: Date.now(),
              reportId,
              text: `Laporan ${reportId} ${msg}`,
              status: newStatus,
              timestamp: updatedAt,
              read: false,
            },
            ...prev,
          ]);

          broadcast("STATUS_UPDATE", { reportId, newStatus, updatedAt });
        }
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    },
    [broadcast]
  );

  // Add a new report via API (citizen)
  const addReport = useCallback(
    async (reportData) => {
      try {
        const res = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportData),
        });

        if (res.ok) {
          const data = await res.json();
          const report = data.report;
          setReports((prev) => [report, ...prev]);
          broadcast("NEW_REPORT", report);
          return { success: true, report };
        } else {
          const data = await res.json();
          return { success: false, error: data.error };
        }
      } catch (error) {
        console.error("Failed to add report:", error);
        return { success: false, error: "Gagal membuat laporan" };
      }
    },
    [broadcast]
  );

  // Get reports for a specific user
  const getReportsByUser = useCallback(
    (userId) => reports.filter((r) => r.user_id === userId),
    [reports]
  );

  // Get a single report
  const getReportById = useCallback(
    (reportId) => reports.find((r) => r.id === reportId),
    [reports]
  );

  // Fetch detail with updates from API
  const fetchReportDetail = useCallback(async (reportId) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error("Failed to fetch report detail:", error);
    }
    return null;
  }, []);

  // Mark notification as read
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Stats (computed from local state)
  const getStats = useCallback(() => {
    const total = reports.length;
    const menunggu = reports.filter((r) => r.status === "Menunggu Verifikasi").length;
    const diverifikasi = reports.filter((r) => r.status === "Diverifikasi").length;
    const diproses = reports.filter((r) => r.status === "Diproses").length;
    const selesai = reports.filter((r) => r.status === "Selesai").length;
    const ditolak = reports.filter((r) => r.status === "Ditolak").length;
    return { total, menunggu, diverifikasi, diproses, selesai, ditolak };
  }, [reports]);

  return (
    <ReportsContext.Provider
      value={{
        reports,
        notifications,
        isLoaded,
        updateReportStatus,
        addReport,
        getReportsByUser,
        getReportById,
        fetchReportDetail,
        fetchReports,
        markNotificationRead,
        clearNotifications,
        getStats,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
