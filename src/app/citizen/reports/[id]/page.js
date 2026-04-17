"use client";

import { useParams, useRouter } from "next/navigation";
import { useReports } from "@/lib/reports-context";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatDateTime } from "@/lib/utils";
import { GlassCard, StatusBadge } from "@/components/glass";
import Timeline from "@/components/reports/Timeline";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FolderOpen,
  Navigation,
  User,
  FileText,
} from "lucide-react";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getReportById, fetchReportDetail } = useReports();
  const { user } = useAuth();

  const report = getReportById(params.id);
  const [detail, setDetail] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetail = async () => {
      const data = await fetchReportDetail(params.id);
      if (data) {
        setDetail(data.report);
        setUpdates(data.updates || []);
      }
      setLoading(false);
    };
    loadDetail();
  }, [params.id, fetchReportDetail]);

  const displayReport = detail || report;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!displayReport) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <GlassCard className="text-center p-8 sm:p-10">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base sm:text-lg font-semibold text-slate-700">Laporan Tidak Ditemukan</h2>
          <button onClick={() => router.back()} className="text-sm text-cyan-600 font-medium mt-3">
            ← Kembali
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-cyan-600 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs sm:text-sm text-slate-400 font-mono">{displayReport.id}</span>
            <StatusBadge status={displayReport.status} />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 leading-tight">{displayReport.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Photo */}
          <GlassCard hover={false}>
            <div className="rounded-lg sm:rounded-xl overflow-hidden bg-slate-100">
              <img
                src={displayReport.photo_url}
                alt={displayReport.title}
                className="w-full h-48 sm:h-64 lg:h-80 object-cover"
              />
            </div>
          </GlassCard>

          {/* Description */}
          <GlassCard hover={false}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-2 sm:mb-3">Deskripsi Masalah</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{displayReport.description}</p>
          </GlassCard>

          {/* Timeline */}
          <GlassCard hover={false}>
            <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-3 sm:mb-5">Riwayat Status</h3>
            <Timeline updates={updates} />
          </GlassCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-3 sm:space-y-4">
          <GlassCard hover={false}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-4">Detail Laporan</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <FolderOpen className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400">Kategori</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">{displayReport.category_name || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Calendar className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400">Tanggal</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">{formatDate(displayReport.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 col-span-2 lg:col-span-1">
                <MapPin className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400">Lokasi</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">{displayReport.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Navigation className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400">Koordinat</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium font-mono">
                    {displayReport.latitude}, {displayReport.longitude}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <User className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-400">Pelapor</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">{displayReport.user_name || user?.name || "—"}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Status Progress */}
          <GlassCard hover={false}>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">Status Saat Ini</h3>
            <StatusBadge status={displayReport.status} />
            <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
              Diperbarui: {formatDateTime(displayReport.updated_at)}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
