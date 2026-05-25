"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useReports } from "@/lib/reports-context";
import { formatDate } from "@/lib/utils";
import { GlassCard, StatusBadge, EmptyState } from "@/components/glass";
import Link from "next/link";
import { Search, Filter, FileText, ArrowUpDown, Eye } from "lucide-react";

const allStatuses = ["Semua", "Menunggu Verifikasi", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];

export default function ReportHistoryPage() {
  const { user } = useAuth();
  const { getReportsByUser } = useReports();
  const allReports = getReportsByUser(user?.id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [sortNewest, setSortNewest] = useState(true);

  const filtered = allReports
    .filter((r) => {
      if (statusFilter !== "Semua" && r.status !== statusFilter) return false;
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.address.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      return sortNewest
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    });

  return (
    <div className="animate-fade-in-up">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Riwayat Laporan</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Semua laporan yang pernah Anda buat.</p>
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-4 sm:mb-6">
        <div className="flex flex-col min-[480px]:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari laporan..."
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 min-[480px]:flex-initial px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm focus:outline-none"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {/* Sort */}
            <button
              onClick={() => setSortNewest(!sortNewest)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm hover:bg-white/60 transition-colors shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden min-[400px]:inline">{sortNewest ? "Terbaru" : "Terlama"}</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Report List */}
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="Tidak ada laporan" description="Tidak ditemukan laporan." />
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filtered.map((report) => (
            <Link key={report.id} href={`/citizen/reports/${report.id}`}>
              <GlassCard className="flex items-center gap-3 cursor-pointer">
                {/* Photo */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  {report.photo_url ? (
                    <img src={report.photo_url} alt={report.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{report.id}</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{report.title}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    {report.category_name || "—"} • {formatDate(report.created_at)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={report.status} />
                  <Eye className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}

      <p className="text-center text-xs sm:text-sm text-slate-400 mt-4 sm:mt-6">
        {filtered.length} dari {allReports.length} laporan
      </p>
    </div>
  );
}
