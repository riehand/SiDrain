"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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
  Save,
  X,
  Upload,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

const LocationMiniMap = dynamic(() => import("@/components/location-mini-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] rounded-2xl bg-slate-100/60 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
    </div>
  ),
});

export default function EditReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { fetchReportDetail, fetchReports } = useReports();
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
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [reportStatus, setReportStatus] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
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

  // Fetch existing report data
  useEffect(() => {
    const loadReport = async () => {
      const data = await fetchReportDetail(params.id);
      if (data?.report) {
        const r = data.report;
        setReportStatus(r.status);

        // Only allow editing if still "Menunggu Verifikasi"
        if (r.status !== "Menunggu Verifikasi") {
          router.replace(`/citizen/reports/${params.id}`);
          return;
        }

        // Check ownership
        if (r.user_id !== parseInt(user?.id)) {
          router.replace("/citizen/reports");
          return;
        }

        setForm({
          title: r.title,
          category_id: String(r.category_id),
          description: r.description,
          address: r.address,
          latitude: r.latitude ? String(r.latitude) : "",
          longitude: r.longitude ? String(r.longitude) : "",
        });
        setExistingPhotoUrl(r.photo_url);
        setPhotoPreview(r.photo_url);
      } else {
        router.replace("/citizen/reports");
      }
      setPageLoading(false);
    };
    if (user?.id) loadReport();
  }, [params.id, user?.id, fetchReportDetail, router]);

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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Browser Anda tidak mendukung fitur geolokasi.");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));
        setIsLocating(false);
        setLocationError("");
        if (errors.location) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.location;
            return next;
          });
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Akses lokasi wajib diizinkan");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Informasi lokasi tidak tersedia.");
            break;
          case error.TIMEOUT:
            setLocationError("Permintaan lokasi habis waktu.");
            break;
          default:
            setLocationError("Gagal mendapatkan lokasi.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Judul wajib diisi";
    if (!form.category_id) e.category_id = "Pilih kategori";
    if (!form.description.trim()) e.description = "Deskripsi wajib diisi";
    if (!form.address.trim()) e.address = "Alamat wajib diisi";
    if (!form.latitude || !form.longitude) {
      e.location = "Lokasi GPS wajib diisi";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Upload new photo if changed
      let photoUrl = existingPhotoUrl;
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
        } else {
          const uploadErr = await uploadRes.json().catch(() => ({}));
          setErrors({ submit: uploadErr.error || "Gagal mengupload foto" });
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/reports/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category_id: parseInt(form.category_id),
          description: form.description,
          photo_url: photoUrl,
          address: form.address,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });

      if (res.ok) {
        // Refresh reports context
        await fetchReports();
        setSuccess(true);
        setTimeout(() => router.push(`/citizen/reports/${params.id}`), 2000);
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || "Gagal memperbarui laporan" });
      }
    } catch (error) {
      setErrors({ submit: "Terjadi kesalahan saat memperbarui laporan" });
    } finally {
      setLoading(false);
    }
  };

  const hasCoordinates = form.latitude !== "" && form.longitude !== "";

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in-up">
        <GlassCard className="text-center p-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Laporan Berhasil Diperbarui!
          </h2>
          <p className="text-slate-500 mt-2">
            Perubahan Anda telah disimpan.
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Mengalihkan ke detail laporan...
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Edit Laporan</h1>
        <p className="text-slate-500 mt-1">
          Perbarui informasi laporan Anda. Hanya laporan dengan status &quot;Menunggu Verifikasi&quot; yang dapat diedit.
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
              placeholder="Judul laporan"
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
              placeholder="Jelaskan masalah..."
              rows={4}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none resize-none ${errors.description ? "border-red-300" : ""}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <Camera className="w-4 h-4" /> Foto Laporan
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
                      setExistingPhotoUrl(null);
                    }}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {photo && (
                    <p className="text-xs text-cyan-600 mt-2">📷 Foto baru dipilih</p>
                  )}
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-cyan-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Klik atau drag & drop foto baru</p>
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
              placeholder="Alamat lengkap"
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none ${errors.address ? "border-red-300" : ""}`}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          {/* GPS Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1.5">
              <Navigation className="w-4 h-4" /> Koordinat GPS
            </label>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="w-full relative overflow-hidden group rounded-2xl py-3.5 px-5 flex items-center justify-center gap-3 font-medium text-sm transition-all duration-300 disabled:cursor-wait border border-white/30 backdrop-blur-xl shadow-lg hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(139, 92, 246, 0.12) 100%)",
                borderColor: hasCoordinates ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 255, 255, 0.3)",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

              {isLocating ? (
                <>
                  <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                  <span className="text-cyan-600">Mencari lokasi...</span>
                </>
              ) : hasCoordinates ? (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/25">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-700 font-semibold">Lokasi Terdeteksi</span>
                  <span className="text-xs text-green-600/80 ml-auto font-mono">
                    {parseFloat(form.latitude).toFixed(6)},{" "}
                    {parseFloat(form.longitude).toFixed(6)}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/25">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700">Perbarui Lokasi GPS</span>
                </>
              )}
            </button>

            {locationError && (
              <div className="mt-2 p-3 rounded-xl bg-red-50/80 border border-red-200/80 flex items-start gap-2 animate-fade-in">
                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600">{locationError}</p>
              </div>
            )}

            {errors.location && !locationError && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}

            {hasCoordinates && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-white/30 shadow-lg animate-fade-in">
                <LocationMiniMap
                  latitude={parseFloat(form.latitude)}
                  longitude={parseFloat(form.longitude)}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3.5 rounded-2xl text-sm font-semibold glass-input hover:bg-white/60 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-glass py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
