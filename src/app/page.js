"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Shield,
  BarChart3,
  FileText,
  Send,
  CheckCircle2,
  Users,
  Camera,
  Map,
  Clock,
  Search,
  ArrowRight,
  Zap,
  Eye,
  Database,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const [stats, setStats] = useState({ total: 0, selesai: 0, diproses: 0, menunggu: 0, diverifikasi: 0, ditolak: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-main">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-cyan-700 mb-6">
                <Image src="/logo.png" alt="SiDrain" width={20} height={20} className="w-5 h-5 object-contain" />
                Sistem Pelaporan Drainase
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
                Laporkan Saluran Air Tersumbat,{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
                  Cegah Banjir Lebih Cepat
                </span>
              </h1>
              <p className="text-lg text-slate-500 mt-6 leading-relaxed max-w-xl">
                Platform digital untuk membantu masyarakat melaporkan masalah drainase seperti saluran tersumbat, sampah menumpuk, dan genangan air agar dapat segera ditindaklanjuti.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/register"
                  className="btn-glass px-8 py-3.5 rounded-2xl text-base font-semibold flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Laporkan Sekarang
                </Link>
                <Link
                  href="#statistik"
                  className="btn-glass-outline px-8 py-3.5 rounded-2xl text-base font-semibold flex items-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  Lihat Dashboard
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="flex flex-wrap gap-6 mt-10">
                {[
                  { val: `${stats.total}+`, label: "Laporan Masuk" },
                  { val: `${stats.selesai}`, label: "Selesai Ditangani" },
                  { val: "5", label: "Wilayah Terpantau" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-cyan-700">{s.val}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative animate-fade-in-up stagger-2 hidden lg:block">
              {/* Main Glass Card */}
              <div className="glass-card p-6 max-w-sm ml-auto relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Laporan Baru</p>
                    <p className="text-xs text-slate-400">Baru saja dikirim</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-cyan-100/60 rounded-full w-full" />
                  <div className="h-3 bg-cyan-100/60 rounded-full w-4/5" />
                  <div className="h-3 bg-cyan-100/60 rounded-full w-3/5" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <p className="text-xs text-slate-400">Bandung, Jawa Barat</p>
                </div>
              </div>

              {/* Floating card 1 */}
              <div className="glass-card p-4 absolute top-4 left-0 z-20 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Selesai Ditangani</p>
                    <p className="text-xs text-green-500 font-bold">{stats.selesai} laporan</p>
                  </div>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="glass-card p-4 absolute bottom-8 left-8 z-20" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Sedang Diproses</p>
                    <p className="text-xs text-amber-500 font-bold">{stats.diproses} laporan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section id="tentang" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-cyan-700 mb-4">
              <Zap className="w-4 h-4" />
              Keunggulan Sistem
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Mengapa Menggunakan{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
                SiDrain?
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                color: "from-cyan-500 to-cyan-600",
                title: "Pelaporan Lebih Cepat",
                desc: "Kirim laporan drainase bermasalah hanya dalam hitungan menit langsung dari perangkat Anda.",
              },
              {
                icon: Eye,
                color: "from-teal-500 to-teal-600",
                title: "Status Penanganan Transparan",
                desc: "Pantau progres penanganan laporan Anda secara real-time dan transparan.",
              },
              {
                icon: Database,
                color: "from-sky-500 to-sky-600",
                title: "Data Tersentralisasi",
                desc: "Seluruh data laporan tersimpan terpusat untuk analisis dan pengambilan keputusan.",
              },
              {
                icon: Shield,
                color: "from-blue-500 to-blue-600",
                title: "Mendukung Pencegahan Banjir",
                desc: "Data laporan membantu menentukan wilayah prioritas penanganan banjir.",
              },
            ].map((b, i) => (
              <div
                key={i}
                className={`glass-card p-6 hover-lift animate-fade-in-up stagger-${i + 1}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center shadow-lg mb-4`}>
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/30 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-cyan-700 mb-4">
              <FileText className="w-4 h-4" />
              Cara Kerja
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Bagaimana{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
                SiDrain Bekerja?
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: Send,
                title: "Warga Mengirim Laporan",
                desc: "Warga melaporkan masalah drainase lengkap dengan foto dan lokasi.",
              },
              {
                step: "02",
                icon: Shield,
                title: "Admin Memverifikasi",
                desc: "Admin memverifikasi kevalidan laporan yang diterima.",
              },
              {
                step: "03",
                icon: Users,
                title: "Petugas Menindaklanjuti",
                desc: "Petugas lapangan ditugaskan untuk menangani masalah.",
              },
              {
                step: "04",
                icon: CheckCircle2,
                title: "Status Diperbarui",
                desc: "Status laporan diperbarui dan warga mendapat pemberitahuan.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`glass-card p-6 text-center hover-lift animate-fade-in-up stagger-${i + 1} relative`}
              >
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {s.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="fitur" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-cyan-700 mb-4">
              <Zap className="w-4 h-4" />
              Fitur Utama
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Fitur{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
                Lengkap & Terintegrasi
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: "Upload Foto", desc: "Lampirkan foto bukti masalah drainase secara langsung." },
              { icon: MapPin, title: "Input Lokasi", desc: "Tentukan lokasi persis masalah dengan peta interaktif." },
              { icon: Search, title: "Pelacakan Status", desc: "Pantau status penanganan laporan Anda kapan saja." },
              { icon: BarChart3, title: "Dashboard Monitoring", desc: "Dashboard komprehensif untuk monitoring data laporan." },
              { icon: Map, title: "Peta Persebaran", desc: "Visualisasi peta persebaran laporan untuk identifikasi hotspot." },
              { icon: TrendingUp, title: "Rekap Data", desc: "Rekap data laporan untuk analisis dan pengambilan keputusan." },
            ].map((f, i) => (
              <div
                key={i}
                className={`glass-card p-6 hover-lift animate-fade-in-up flex items-start gap-4`}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PUBLIC STATS SECTION ===== */}
      <section id="statistik" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-50/30 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-cyan-700 mb-4">
              <BarChart3 className="w-4 h-4" />
              Statistik Sistem
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
              Dashboard{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">
                Publik
              </span>
            </h2>
            <p className="text-slate-500 mt-2">Data metrik sistem pelaporan saluran air</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, label: "Total Laporan", value: stats.total, color: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-500/20" },
              { icon: Clock, label: "Sedang Diproses", value: stats.diproses + stats.menunggu + stats.diverifikasi, color: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20" },
              { icon: CheckCircle2, label: "Selesai Ditangani", value: stats.selesai, color: "from-green-500 to-green-600", shadow: "shadow-green-500/20" },
              { icon: AlertTriangle, label: "Titik Rawan Terpantau", value: "5", color: "from-teal-500 to-teal-600", shadow: "shadow-teal-500/20" },
            ].map((s, i) => (
              <div key={i} className={`glass-card p-6 hover-lift animate-fade-in-up stagger-${i + 1}`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg ${s.shadow} mb-4`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-800">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-10 sm:p-16 animate-fade-in-up">
            <div className="flex items-center justify-center mx-auto mb-6">
              <Image src="/logo.png" alt="SiDrain Logo" width={64} height={64} className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
              Setiap Laporan Anda Membantu Mencegah Banjir Lebih Dini
            </h2>
            <p className="text-slate-500 mb-8 max-w-lg mx-auto">
              Bergabunglah bersama ribuan warga lainnya dalam melaporkan masalah drainase di lingkungan Anda.
            </p>
            <Link
              href="/register"
              className="btn-glass px-10 py-4 rounded-2xl text-lg font-semibold inline-flex items-center gap-2"
            >
              Mulai Laporkan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
