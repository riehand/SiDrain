"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { Droplets, Menu, X, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/#tentang", label: "Tentang" },
    { href: "/#fitur", label: "Fitur" },
    { href: "/#statistik", label: "Dashboard Publik" },
  ];

  return (
    <nav className="glass-navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
              SiDrain
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-cyan-700 rounded-lg hover:bg-cyan-50/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-cyan-700 rounded-lg hover:bg-cyan-50/50 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-glass px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-cyan-50/50 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-strong border-t border-white/30 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-cyan-700 rounded-lg hover:bg-cyan-50/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/30 my-2" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-cyan-700 rounded-lg hover:bg-cyan-50/50 transition-all text-center"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block btn-glass px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
