"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/lib/reports-context";
import { GlassCard, StatCard } from "@/components/glass";
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  MapPin,
  PieChart as PieIcon,
  FolderOpen,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";

export default function AnalyticsPage() {
  const { reports } = useReports();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = (type) => {
    if (type === "csv") {
      const headers = "ID,Judul,Kategori,Status,Lokasi,Tanggal\n";
      const rows = reports.map((r) => `${r.id},"${r.title}","${r.category_name || r.category_id}","${r.status}","${r.address}","${r.created_at}"`).join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rekap_laporan_sidrain.csv";
      a.click();
    }
  };

  const COLORS = ["#06b6d4", "#14b8a6", "#0ea5e9", "#0891b2", "#2dd4bf"];

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rekap & Analitik</h1>
          <p className="text-slate-500 mt-1">Analisis data laporan untuk pengambilan keputusan.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="btn-glass-outline px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="btn-glass px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FileText} label="Total Laporan" value={stats.total} color="cyan" />
        <StatCard icon={FolderOpen} label="Kategori Aktif" value={stats.categoryStats?.length || 4} color="teal" />
        <StatCard icon={MapPin} label="Wilayah Terpantau" value={stats.regionStats?.length || 0} color="blue" />
        <StatCard icon={TrendingUp} label="Rata-rata/Bulan" value={(stats.total / 12).toFixed(1)} color="green" />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trend */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-semibold text-slate-800">Tren Laporan per Bulan</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                  }}
                />
                <Area type="monotone" dataKey="laporan" stroke="#06b6d4" strokeWidth={2} fill="url(#areaGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Status Distribution */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-semibold text-slate-800">Distribusi Status Laporan</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-semibold text-slate-800">Laporan per Kategori</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} width={150} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {stats.categoryStats.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Region Stats */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-semibold text-slate-800">Laporan per Wilayah</h3>
          </div>
          <div className="space-y-4">
            {stats.regionStats.map((reg, i) => {
              const percentage = (reg.count / stats.total) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{reg.name}</span>
                    <span className="text-sm font-semibold text-cyan-600">{reg.count} laporan ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-3 bg-cyan-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="mt-6 pt-4 border-t border-white/30">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: stats.total },
                { label: "Selesai", value: stats.selesai },
                { label: "Tertunda", value: stats.menunggu + (stats.diverifikasi || 0) + stats.diproses },
              ].map((item, i) => (
                <div key={i} className="glass p-3 rounded-xl text-center">
                  <p className="text-xl font-bold text-slate-800">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
