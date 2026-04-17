"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useReports } from "@/lib/reports-context";
import { GlassCard } from "@/components/glass";
import {
  FileText,
  FolderOpen,
  AlignLeft,
  Camera,
  MapPin,
  Navigation,
  Send,
  X,
  Upload,
  CheckCircle2,
} from "lucide-react";

export default function CreateReportPage() {
  const { user } = useAuth();
  const { addReport } = useReports();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category_id: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Judul wajib diisi";
    if (!form.category_id) e.category_id = "Pilih kategori";
    if (!form.description.trim()) e.description = "Deskripsi wajib diisi";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Upload photo first if exists
      let photoUrl = null;
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photoUrl = uploadData.url;
        }
      }

      // Create report via API
      const result = await addReport({
        title: form.title,
        category_id: parseInt(form.category_id),
        description: form.description,
        photo_url: photoUrl || "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
        address: form.address,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        region: "Jakarta",
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/citizen/reports"), 2000);
      } else {
        setErrors({ submit: result.error || "Gagal membuat laporan" });
      }
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan saat mengirim laporan" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in-up">
        <GlassCard className="text-center p-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Berhasil Dikirim!</h2>
          <p className="text-slate-500 mt-2">Laporan Anda akan segera diverifikasi oleh admin.</p>
          <p className="text-sm text-slate-400 mt-3">Mengalihkan ke riwayat laporan...</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Buat Laporan Baru</h1>
        <p className="text-slate-500 mt-1">
          Laporkan masalah drainase di lingkungan Anda dengan lengkap dan akurat.
        </p>
      </div>

      <GlassCard hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
              {errors.submit}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <FileText className="w-4 h-4" /> Judul Laporan
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="Contoh: Saluran air tersumbat di Jl. Merdeka"
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none ${errors.title ? "border-red-300" : ""}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <FolderOpen className="w-4 h-4" /> Kategori Laporan
            </label>
            <select
              value={form.category_id}
              onChange={handleChange("category_id")}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none ${errors.category_id ? "border-red-300" : ""}`}
            >
              <option value="">Pilih kategori...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <AlignLeft className="w-4 h-4" /> Deskripsi Masalah
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Jelaskan masalah yang Anda temukan secara detail..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none resize-none ${errors.description ? "border-red-300" : ""}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <Camera className="w-4 h-4" /> Upload Foto
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-200/80 rounded-2xl p-6 text-center cursor-pointer hover:border-cyan-400/80 hover:bg-cyan-50/30 transition-all"
            >
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    Klik atau drag & drop foto di sini
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, JPEG (Maks. 5MB)</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <MapPin className="w-4 h-4" /> Alamat / Lokasi Kejadian
            </label>
            <input
              type="text"
              value={form.address}
              onChange={handleChange("address")}
              placeholder="Masukkan alamat lengkap lokasi masalah"
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none ${errors.address ? "border-red-300" : ""}`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
                <Navigation className="w-4 h-4" /> Latitude
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange("latitude")}
                placeholder="-6.2088"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
                <Navigation className="w-4 h-4" /> Longitude
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange("longitude")}
                placeholder="106.8456"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Auto Date */}
          <div className="glass p-4 rounded-xl">
            <p className="text-sm text-slate-500">
              📅 Tanggal Laporan: <span className="font-medium text-slate-700">{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-glass py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Kirim Laporan
              </>
            )}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
