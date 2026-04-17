"use client";

import { useEffect, useState } from "react";
import { useReports } from "@/lib/reports-context";
import { CheckCircle2, Shield, Loader2, XCircle, X, Bell } from "lucide-react";

const statusIcons = {
  "Diverifikasi": Shield,
  "Diproses": Loader2,
  "Selesai": CheckCircle2,
  "Ditolak": XCircle,
};

const statusStyles = {
  "Diverifikasi": "from-blue-500 to-blue-600 shadow-blue-500/30",
  "Diproses": "from-amber-500 to-amber-600 shadow-amber-500/30",
  "Selesai": "from-green-500 to-green-600 shadow-green-500/30",
  "Ditolak": "from-red-500 to-red-600 shadow-red-500/30",
};

const statusBg = {
  "Diverifikasi": "bg-blue-50 border-blue-200",
  "Diproses": "bg-amber-50 border-amber-200",
  "Selesai": "bg-green-50 border-green-200",
  "Ditolak": "bg-red-50 border-red-200",
};

export default function ToastNotifications() {
  const { notifications } = useReports();
  const [visibleToasts, setVisibleToasts] = useState([]);
  const [lastCount, setLastCount] = useState(0);

  // Watch for new notifications and show toast
  useEffect(() => {
    if (notifications.length > lastCount && lastCount > 0) {
      const newOnes = notifications.slice(0, notifications.length - lastCount);
      newOnes.forEach((n) => {
        const toastId = `toast-${n.id}`;
        setVisibleToasts((prev) => [
          { ...n, toastId, entering: true },
          ...prev.slice(0, 4), // max 5 toasts
        ]);

        // Remove entering animation
        setTimeout(() => {
          setVisibleToasts((prev) =>
            prev.map((t) => (t.toastId === toastId ? { ...t, entering: false } : t))
          );
        }, 100);

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
          setVisibleToasts((prev) =>
            prev.map((t) => (t.toastId === toastId ? { ...t, exiting: true } : t))
          );
          setTimeout(() => {
            setVisibleToasts((prev) => prev.filter((t) => t.toastId !== toastId));
          }, 400);
        }, 6000);
      });
    }
    setLastCount(notifications.length);
  }, [notifications.length]);

  const dismissToast = (toastId) => {
    setVisibleToasts((prev) =>
      prev.map((t) => (t.toastId === toastId ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setVisibleToasts((prev) => prev.filter((t) => t.toastId !== toastId));
    }, 400);
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {visibleToasts.map((toast) => {
        const Icon = statusIcons[toast.status] || Bell;
        const gradientClass = statusStyles[toast.status] || "from-cyan-500 to-cyan-600 shadow-cyan-500/30";
        const bgClass = statusBg[toast.status] || "bg-cyan-50 border-cyan-200";

        return (
          <div
            key={toast.toastId}
            className={`pointer-events-auto glass-strong rounded-2xl p-4 border transition-all duration-400 ${bgClass} ${
              toast.entering
                ? "opacity-0 translate-x-8"
                : toast.exiting
                ? "opacity-0 translate-x-8"
                : "opacity-100 translate-x-0"
            }`}
            style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg shrink-0`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700">Status Diperbarui</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.text}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.toastId)}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
