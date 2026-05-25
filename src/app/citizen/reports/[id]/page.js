"use client";

import { useParams, useRouter } from "next/navigation";
import { useReports } from "@/lib/reports-context";
import { useAuth } from "@/lib/auth-context";
import { formatDate, formatDateTime } from "@/lib/utils";
import { GlassCard, StatusBadge } from "@/components/glass";
import Timeline from "@/components/reports/Timeline";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FolderOpen,
  Navigation,
  User,
  FileText,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  Camera,
} from "lucide-react";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getReportById, fetchReportDetail, deleteReport } = useReports();
  const { user } = useAuth();

  const report = getReportById(params.id);
  const [detail, setDetail] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const canEdit = displayReport?.status === "Menunggu Verifikasi" && displayReport?.user_id === parseInt(user?.id);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    const result = await deleteReport(params.id);
    if (result.success) {
      router.replace("/citizen/reports");
    } else {
      setDeleteError(result.error || "Gagal menghapus laporan");
      setDeleting(false);
    }
  };

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
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-card p-6 sm:p-8 max-w-md w-full relative animate-fade-in-up">
            <button
              onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/60 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Laporan?</h3>
              <p className="text-sm text-slate-500 mb-1">
                Anda yakin ingin menghapus laporan <strong className="text-slate-700">{displayReport.id}</strong>?
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Tindakan ini tidak dapat dibatalkan. Foto dan riwayat status akan ikut terhapus.
              </p>

              {deleteError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 mb-4 animate-fade-in">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteError(""); }}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl glass-input text-sm font-semibold hover:bg-white/60 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-cyan-600 mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs sm:text-sm text-slate-400 font-mono">{displayReport.id}</span>
            <StatusBadge status={displayReport.status} />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 leading-tight">{displayReport.title}</h1>
        </div>

        {/* Edit & Delete Buttons */}
        {canEdit && (
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/citizen/reports/${displayReport.id}/edit`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold glass hover:bg-cyan-50/50 text-cyan-700 transition-all border border-cyan-200/50"
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden min-[400px]:inline">Edit</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold glass hover:bg-red-50/50 text-red-600 transition-all border border-red-200/50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden min-[400px]:inline">Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Photo */}
          <GlassCard hover={false}>
            <div className="rounded-lg sm:rounded-xl overflow-hidden bg-slate-100">
              {displayReport.photo_url ? (
                <img
                  src={displayReport.photo_url}
                  alt={displayReport.title}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-48 sm:h-64 lg:h-80 flex flex-col items-center justify-center text-slate-400">
                  <Camera className="w-12 h-12 mb-2 opacity-40" />
                  <p className="text-sm">Tidak ada foto</p>
                </div>
              )}
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

          {/* Edit hint for non-editable reports */}
          {!canEdit && displayReport?.user_id === parseInt(user?.id) && displayReport?.status !== "Menunggu Verifikasi" && (
            <GlassCard hover={false}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-500">
                  Laporan yang sudah diverifikasi atau diproses tidak dapat diedit atau dihapus.
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

