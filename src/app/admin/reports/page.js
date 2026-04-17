"use client";

import { useState, useEffect } from "react";
import { useReports } from "@/lib/reports-context";
import { formatDate } from "@/lib/utils";
import { GlassCard, StatusBadge } from "@/components/glass";
import Timeline from "@/components/reports/Timeline";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const allStatuses = ["Semua", "Menunggu Verifikasi", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];
const statusOptions = ["Menunggu Verifikasi", "Diverifikasi", "Diproses", "Selesai", "Ditolak"];

export default function AdminReportsPage() {
  const { reports, updateReportStatus, fetchReportDetail } = useReports();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const perPage = 8;

  // Fetch categories from API
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

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "—";
  };

  const filtered = reports.filter((r) => {
    if (statusFilter !== "Semua" && r.status !== statusFilter) return false;
    if (categoryFilter !== "all" && r.category_id !== parseInt(categoryFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.address.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleUpdateStatus = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminNote("");
    setShowStatusModal(true);
  };

  const submitStatusUpdate = async () => {
    if (selectedReport && newStatus) {
      await updateReportStatus(selectedReport.id, newStatus, adminNote || `Status diperbarui ke ${newStatus}`, "Admin SiDrain");
      setShowStatusModal(false);
      setSelectedReport(null);
    }
  };

  const [detailReport, setDetailReport] = useState(null);
  const [detailUpdates, setDetailUpdates] = useState([]);
  const liveDetailReport = detailReport ? reports.find((r) => r.id === detailReport.id) || detailReport : null;

  const openDetail = async (report) => {
    setDetailReport(report);
    // Fetch updates from API
    const data = await fetchReportDetail(report.id);
    if (data) {
      setDetailUpdates(data.updates || []);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Manajemen Laporan</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Kelola semua laporan masuk dari warga.</p>
      </div>

      {/* Filters */}
      <GlassCard hover={false} className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari ID, judul, lokasi..."
              className="w-full pl-10 sm:pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm focus:outline-none"
            >
              {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* MOBILE: Card-based report list */}
      <div className="lg:hidden space-y-2 sm:space-y-3">
        {paginated.map((report) => (
          <GlassCard key={report.id} hover={false} className="space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img src={report.photo_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] text-slate-400 font-mono">{report.id}</span>
                  <StatusBadge status={report.status} />
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate">{report.title}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                  {report.user_name || "—"} • {report.category_name || getCategoryName(report.category_id)}
                </p>
                <p className="text-[10px] text-slate-400">{report.address} • {formatDate(report.created_at)}</p>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/20">
              <button
                onClick={() => openDetail(report)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-600 hover:bg-cyan-50 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Detail
              </button>
              {report.status === "Menunggu Verifikasi" && (
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setNewStatus("Diverifikasi");
                    setAdminNote("Laporan telah diverifikasi.");
                    setShowStatusModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" /> Verifikasi
                </button>
              )}
              <button
                onClick={() => handleUpdateStatus(report)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors"
              >
                <Loader2 className="w-3.5 h-3.5" /> Update
              </button>
              {report.status !== "Ditolak" && report.status !== "Selesai" && (
                <button
                  onClick={() => {
                    setSelectedReport(report);
                    setNewStatus("Ditolak");
                    setAdminNote("");
                    setShowStatusModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors ml-auto"
                >
                  <XCircle className="w-3.5 h-3.5" /> Tolak
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* DESKTOP: Table */}
      <GlassCard hover={false} className="overflow-x-auto hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30">
              <th className="text-left py-3 px-4 font-semibold text-slate-600">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Pelapor</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Judul</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Kategori</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Lokasi</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Tanggal</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((report) => (
              <tr key={report.id} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-slate-500">{report.id}</td>
                <td className="py-3 px-4 text-slate-700">{report.user_name || "—"}</td>
                <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">{report.title}</td>
                <td className="py-3 px-4 text-slate-500 text-xs">{report.category_name || getCategoryName(report.category_id)}</td>
                <td className="py-3 px-4 text-slate-500 text-xs max-w-[150px] truncate">{report.address}</td>
                <td className="py-3 px-4 text-slate-500 text-xs">{formatDate(report.created_at)}</td>
                <td className="py-3 px-4"><StatusBadge status={report.status} /></td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openDetail(report)} className="p-1.5 rounded-lg hover:bg-cyan-50 text-cyan-500 transition-colors" title="Detail">
                      <Eye className="w-4 h-4" />
                    </button>
                    {report.status === "Menunggu Verifikasi" && (
                      <button
                        onClick={() => { setSelectedReport(report); setNewStatus("Diverifikasi"); setAdminNote("Laporan telah diverifikasi."); setShowStatusModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Verifikasi"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => handleUpdateStatus(report)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition-colors" title="Update">
                      <Loader2 className="w-4 h-4" />
                    </button>
                    {report.status !== "Ditolak" && report.status !== "Selesai" && (
                      <button
                        onClick={() => { setSelectedReport(report); setNewStatus("Ditolak"); setAdminNote(""); setShowStatusModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Tolak"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs sm:text-sm text-slate-400">
            {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 sm:p-2 rounded-lg glass hover:bg-white/60 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg"
                    : "glass hover:bg-white/60 text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 sm:p-2 rounded-lg glass hover:bg-white/60 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedReport && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-6 sm:p-8 w-full sm:max-w-md sm:mx-4 rounded-t-2xl sm:rounded-2xl animate-fade-in-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">Update Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="glass p-3 rounded-xl">
                <p className="text-[10px] sm:text-xs text-slate-400">Laporan</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700">{selectedReport.id} — {selectedReport.title}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Status Baru</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-4 py-2.5 sm:py-3 rounded-xl glass-input text-sm focus:outline-none">
                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1.5">Catatan</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Tambahkan catatan..." rows={3} className="w-full px-4 py-2.5 sm:py-3 rounded-xl glass-input text-sm focus:outline-none resize-none" />
              </div>
              <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
                <button onClick={() => setShowStatusModal(false)} className="flex-1 py-2.5 sm:py-3 rounded-xl btn-glass-outline font-medium text-xs sm:text-sm">Batal</button>
                <button onClick={submitStatusUpdate} className="flex-1 py-2.5 sm:py-3 rounded-xl btn-glass font-medium text-xs sm:text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {liveDetailReport && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
          <div className="glass-card p-5 sm:p-8 w-full sm:max-w-2xl sm:mx-4 rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm text-slate-400 font-mono">{liveDetailReport.id}</span>
                  <StatusBadge status={liveDetailReport.status} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">{liveDetailReport.title}</h3>
              </div>
              <button onClick={() => { setDetailReport(null); setDetailUpdates([]); }} className="p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-slate-100 mb-3 sm:mb-4">
              <img src={liveDetailReport.photo_url} alt="" className="w-full h-36 sm:h-48 object-cover" />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">{liveDetailReport.description}</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="glass p-2 sm:p-3 rounded-xl">
                <p className="text-[10px] sm:text-xs text-slate-400">Pelapor</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700">{liveDetailReport.user_name || "—"}</p>
              </div>
              <div className="glass p-2 sm:p-3 rounded-xl">
                <p className="text-[10px] sm:text-xs text-slate-400">Kategori</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700">{liveDetailReport.category_name || getCategoryName(liveDetailReport.category_id)}</p>
              </div>
              <div className="glass p-2 sm:p-3 rounded-xl">
                <p className="text-[10px] sm:text-xs text-slate-400">Lokasi</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">{liveDetailReport.address}</p>
              </div>
              <div className="glass p-2 sm:p-3 rounded-xl">
                <p className="text-[10px] sm:text-xs text-slate-400">Tanggal</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700">{formatDate(liveDetailReport.created_at)}</p>
              </div>
            </div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">Riwayat Status</h4>
            <Timeline updates={detailUpdates} />
          </div>
        </div>
      )}
    </div>
  );
}
