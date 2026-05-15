import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-strong border-t border-white/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="SiDrain Logo" width={36} height={36} className="w-9 h-9 object-contain" />
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
                SiDrain
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Platform digital untuk membantu masyarakat melaporkan masalah drainase dan mencegah banjir.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Navigasi</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/#tentang", label: "Tentang" },
                { href: "/#fitur", label: "Fitur" },
                { href: "/#statistik", label: "Statistik" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-cyan-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Layanan</h4>
            <ul className="space-y-2">
              {[
                "Pelaporan Drainase",
                "Pelacakan Status",
                "Peta Persebaran",
                "Rekap Data",
              ].map((item) => (
                <li key={item}>
                  <span className="text-sm text-slate-500">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3">Kontak</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>📞 0881 085 156 156 (admin)</li>
              <li>📍 Bandung</li>
            </ul>
          </div>
        </div>

        <hr className="border-white/40 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © 2026 SiDrain. Sistem Pelaporan Saluran Air Tersumbat.
          </p>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> untuk Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
