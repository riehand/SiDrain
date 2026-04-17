"use client";

import { useAuth } from "@/lib/auth-context";
import { useReports } from "@/lib/reports-context";
import { formatDate } from "@/lib/utils";
import { StatCard, GlassCard, StatusBadge } from "@/components/glass";
import Link from "next/link";
import {
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  FilePlus,
  History,
  Bell,
  ArrowRight,
} from "lucide-react";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { getReportsByUser, notifications, isLoaded } = useReports();
  const reports = getReportsByUser(user?.id);

  const stats = {
    total: reports.length,
    menunggu: reports.filter((r) => r.status === "Menunggu Verifikasi").length,
    diproses: reports.filter((r) => r.status === "Diproses" || r.status === "Diverifikasi").length,
    selesai: reports.filter((r) => r.status === "Selesai").length,
  };

  const latestReports = [...reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);

  const userReportIds = reports.map((r) => r.id);
  const userNotifications = notifications
    .filter((n) => userReportIds.includes(n.reportId))
    .slice(0, 5);

  const displayNotifications = userNotifications.length > 0
    ? userNotifications.map((n) => ({
        text: n.text,
        time: getRelativeTime(n.timestamp),
        type: n.status === "Selesai" ? "success" : n.status === "Ditolak" ? "danger" : "info",
        read: n.read,
      }))
    : [
        { text: "Selamat datang di SiDrain! Mulai laporkan masalah drainase.", time: "Baru saja", type: "info", read: true },
      ];

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8 animate-fade-in-up">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">
          Selamat Datang, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Pantau dan kelola laporan drainase Anda.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={FileText} label="Total Laporan" value={stats.total} color="cyan" />
        <StatCard icon={Clock} label="Menunggu" value={stats.menunggu} color="gray" />
        <StatCard icon={Loader2} label="Diproses" value={stats.diproses} color="amber" />
        <StatCard icon={CheckCircle2} label="Selesai" value={stats.selesai} color="green" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
        <Link href="/citizen/reports/new">
          <GlassCard className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow shrink-0">
              <FilePlus className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-semibold text-slate-800">Buat Laporan</p>
              <p className="text-xs sm:text-sm text-slate-500 hidden min-[400px]:block">Laporkan masalah drainase</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 ml-auto group-hover:text-cyan-500 transition-colors shrink-0" />
          </GlassCard>
        </Link>
        <Link href="/citizen/reports">
          <GlassCard className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow shrink-0">
              <History className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-semibold text-slate-800">Lihat Riwayat</p>
              <p className="text-xs sm:text-sm text-slate-500 hidden min-[400px]:block">Cek status laporan Anda</p>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 ml-auto group-hover:text-teal-500 transition-colors shrink-0" />
          </GlassCard>
        </Link>
      </div>

      {/* Latest Reports */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800">Laporan Terbaru</h2>
          <Link href="/citizen/reports" className="text-xs sm:text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
            Semua <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {latestReports.length === 0 ? (
            <GlassCard className="text-center py-8 sm:py-10">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm text-slate-500">Belum ada laporan</p>
              <Link href="/citizen/reports/new" className="text-sm text-cyan-600 font-medium mt-2 inline-block">
                Buat Laporan Pertama
              </Link>
            </GlassCard>
          ) : (
            latestReports.map((report) => (
              <Link key={report.id} href={`/citizen/reports/${report.id}`}>
                <GlassCard className="flex items-center gap-3 cursor-pointer">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={report.photo_url}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">{report.title}</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      {report.category_name || "—"} • {formatDate(report.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </GlassCard>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Live Notifications */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
          Notifikasi
          {userNotifications.filter((n) => !n.read).length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {userNotifications.filter((n) => !n.read).length}
            </span>
          )}
        </h2>
        <div className="space-y-2">
          {displayNotifications.map((n, i) => (
            <GlassCard key={i} hover={false} className={`flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 transition-all ${!n.read ? 'ring-1 ring-cyan-200/50 bg-cyan-50/20' : ''}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                n.type === "success" ? "bg-green-400" :
                n.type === "danger" ? "bg-red-400" :
                "bg-cyan-400"
              } ${!n.read ? 'animate-pulse-soft' : ''}`} />
              <p className={`text-xs sm:text-sm flex-1 leading-snug ${!n.read ? 'text-slate-700 font-medium' : 'text-slate-600'}`}>{n.text}</p>
              <p className="text-[10px] sm:text-xs text-slate-400 shrink-0">{n.time}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRelativeTime(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) return "Baru saja";
  if (diffSec < 60) return `${diffSec}d lalu`;
  if (diffMin < 60) return `${diffMin}m lalu`;
  if (diffHour < 24) return `${diffHour}j lalu`;
  if (diffDay < 7) return `${diffDay}h lalu`;
  return formatDate(timestamp);
}
