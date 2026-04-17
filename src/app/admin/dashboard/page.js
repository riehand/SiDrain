"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/lib/reports-context";
import { formatDate } from "@/lib/utils";
import { StatCard, GlassCard, StatusBadge } from "@/components/glass";
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  MapPin,
  Activity,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function AdminDashboard() {
  const { reports, getStats } = useReports();
  const stats = getStats();
  const [apiStats, setApiStats] = useState(null);
  const recentReports = [...reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setApiStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const monthlyData = apiStats?.monthlyData || [];
  const categoryStats = apiStats?.categoryStats || [];
  const statusData = apiStats?.statusData || [];
  const regionStats = apiStats?.regionStats || [];

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Dashboard Admin</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Ringkasan data sistem pelaporan drainase.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard icon={FileText} label="Total Laporan" value={stats.total} color="cyan" />
        <StatCard icon={Clock} label="Menunggu" value={stats.menunggu} color="gray" />
        <StatCard icon={Loader2} label="Diproses" value={stats.diproses} color="amber" />
        <StatCard icon={CheckCircle2} label="Selesai" value={stats.selesai} color="green" />
        <StatCard icon={XCircle} label="Ditolak" value={stats.ditolak} color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Trend */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-800">Tren Bulanan</h3>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 10 }} width={30} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="laporan" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Status Distribution */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-800">Distribusi Status</h3>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-[10px] sm:text-xs text-slate-600">{value}</span>}
                  wrapperStyle={{ fontSize: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Category Stats */}
        <GlassCard hover={false}>
          <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-3 sm:mb-4">Laporan per Kategori</h3>
          <div className="space-y-2.5 sm:space-y-3">
            {categoryStats.map((cat, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-slate-600 truncate">{cat.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 sm:w-20 h-2 bg-cyan-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                      style={{ width: `${stats.total > 0 ? (cat.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 w-5 text-right">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Top Regions */}
        <GlassCard hover={false}>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-800">Wilayah Terbanyak</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {regionStats.map((reg, i) => (
              <div key={i} className="flex items-center justify-between glass p-2.5 sm:p-3 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center text-xs sm:text-sm font-bold text-cyan-600">
                    {i + 1}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{reg.name}</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-cyan-600">{reg.count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Reports */}
        <GlassCard hover={false}>
          <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-3 sm:mb-4">Laporan Terbaru</h3>
          <div className="space-y-2 sm:space-y-3">
            {recentReports.map((r) => (
              <div key={r.id} className="flex items-center gap-2.5 sm:gap-3 glass p-2 sm:p-3 rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img src={r.photo_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">{r.title}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400">{formatDate(r.created_at)}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
