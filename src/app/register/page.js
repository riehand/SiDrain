"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Droplets, User, Mail, Phone, MapPin, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", password: "", confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nama lengkap wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    if (!form.phone.trim()) e.phone = "Nomor HP wajib diisi";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    if (!form.password) e.password = "Password wajib diisi";
    else if (form.password.length < 6) e.password = "Password minimal 6 karakter";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Password tidak cocok";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);

    const result = await register(form);
    if (result.success) {
      // Wait for session then redirect
      setTimeout(() => {
        router.push("/citizen/dashboard");
        router.refresh();
      }, 500);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const fields = [
    { key: "name", label: "Nama Lengkap", type: "text", icon: User, placeholder: "Masukkan nama lengkap" },
    { key: "email", label: "Email", type: "email", icon: Mail, placeholder: "contoh@email.com" },
    { key: "phone", label: "Nomor HP", type: "tel", icon: Phone, placeholder: "08xxxxxxxxxx" },
    { key: "address", label: "Alamat", type: "text", icon: MapPin, placeholder: "Masukkan alamat lengkap" },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Droplets className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mt-4">Daftar Akun Baru</h1>
          <p className="text-slate-500 mt-1">Bergabunglah untuk membantu mencegah banjir</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
                {error}
              </div>
            )}

            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                    placeholder={f.placeholder}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm focus:outline-none ${
                      errors[f.key] ? "border-red-300 bg-red-50/30" : ""
                    }`}
                  />
                </div>
                {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Minimal 6 karakter"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl glass-input text-sm focus:outline-none ${
                    errors.password ? "border-red-300 bg-red-50/30" : ""
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Ulangi password"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm focus:outline-none ${
                    errors.confirmPassword ? "border-red-300 bg-red-50/30" : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glass py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Daftar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-cyan-600 font-semibold hover:text-cyan-700">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
