"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  LogOut,
  Droplets,
  Map,
  FolderOpen,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

const citizenLinks = [
  { href: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/citizen/reports/new", label: "Buat Laporan", icon: FilePlus },
  { href: "/citizen/reports", label: "Riwayat Laporan", icon: FileText },
];

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Manajemen Laporan", icon: FileText },
  { href: "/admin/map", label: "Peta Laporan", icon: Map },
  { href: "/admin/categories", label: "Kategori", icon: FolderOpen },
  { href: "/admin/analytics", label: "Rekap Data", icon: BarChart3 },
];

// Bottom nav items (subset for mobile)
const citizenBottomNav = [
  { href: "/citizen/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/citizen/reports/new", label: "Lapor", icon: FilePlus },
  { href: "/citizen/reports", label: "Riwayat", icon: FileText },
];

const adminBottomNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Laporan", icon: FileText },
  { href: "/admin/map", label: "Peta", icon: Map },
  { href: "/admin/analytics", label: "Rekap", icon: BarChart3 },
];

export default function Sidebar({ role = "citizen" }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const links = role === "admin" ? adminLinks : citizenLinks;
  const bottomLinks = role === "admin" ? adminBottomNav : citizenBottomNav;

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-navbar h-14 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
            SiDrain
          </span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:bg-white/60 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </header>

      {/* ===== MOBILE DRAWER OVERLAY ===== */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ===== MOBILE DRAWER ===== */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-[70] w-72 glass-sidebar bg-gradient-sidebar flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
              SiDrain
            </span>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-3 border-b border-white/20">
            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role === "admin" ? "Administrator" : "Warga"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-teal-500/10 text-cyan-700 border border-cyan-200/40"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-600" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={() => { logout(); window.location.href = "/"; }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50/50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex glass-sidebar bg-gradient-sidebar fixed left-0 top-0 bottom-0 z-40 w-64 flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
              SiDrain
            </span>
          </Link>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-4 py-4 border-b border-white/20">
            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {user.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role === "admin" ? "Administrator" : "Warga"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-gradient-to-r from-cyan-500/15 to-teal-500/10 text-cyan-700 border border-cyan-200/40"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/40"
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-600" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={() => { logout(); window.location.href = "/"; }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50/50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-navbar border-t border-white/30">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-0 ${isActive
                    ? "text-cyan-600"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                <div className={`${isActive ? "w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 -mt-5 mb-0.5" : ""}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                </div>
                <span className="text-[10px] font-medium leading-tight">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
