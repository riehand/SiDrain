"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/lib/reports-context";
import { GlassCard } from "@/components/glass";
import ReportMap from "@/components/maps/ReportMap";
import { MapPin, Filter } from "lucide-react";

const allStatuses = ["all", "Menunggu Verifikasi", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];
const statusLabels = {
  all: "Semua Status",
  "Menunggu Verifikasi": "Menunggu",
  "Diverifikasi": "Diverifikasi",
  "Diproses": "Diproses",
  "Selesai": "Selesai",
  "Ditolak": "Ditolak",
};

const statusColors = {
  "Menunggu Verifikasi": "#9ca3af",
  "Diverifikasi": "#3b82f6",
  "Diproses": "#f59e0b",
  "Selesai": "#22c55e",
  "Ditolak": "#ef4444",
};

export default function AdminMapPage() {
  const { reports } = useReports();
  const [categories, setCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Peta Persebaran Laporan</h1>
        <p className="text-slate-500 mt-1">Visualisasi lokasi laporan untuk identifikasi titik rawan banjir.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="space-y-4">
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-semibold text-slate-700">Filter</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm focus:outline-none"
                >
                  {allStatuses.map((s) => (
                    <option key={s} value={s}>{statusLabels[s] || s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-sm focus:outline-none"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Legend */}
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Legenda</h3>
            <div className="space-y-2">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-slate-600">{status}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Summary */}
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Ringkasan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Total Marker</span>
                <span className="text-xs font-semibold text-slate-700">
                  {reports.filter((r) => {
                    if (selectedStatus !== "all" && r.status !== selectedStatus) return false;
                    if (selectedCategory !== "all" && r.category_id !== parseInt(selectedCategory)) return false;
                    return true;
                  }).length}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Selected Report */}
          {selectedReport && (
            <GlassCard hover={false}>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Detail Marker</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">{selectedReport.title}</p>
                <p className="text-xs text-slate-500">{selectedReport.address}</p>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium" style={{
                  background: `${statusColors[selectedReport.status]}20`,
                  color: statusColors[selectedReport.status],
                }}>
                  {selectedReport.status}
                </span>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <GlassCard hover={false} className="p-2">
            <div className="h-[600px] rounded-2xl overflow-hidden">
              <ReportMap
                reports={reports}
                onMarkerClick={setSelectedReport}
                selectedStatus={selectedStatus}
                selectedCategory={selectedCategory}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
