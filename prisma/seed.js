require("dotenv").config();
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const bcrypt = require("bcryptjs");

const adapter = new PrismaBetterSqlite3({
  url: "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.reportUpdate.deleteMany();
  await prisma.report.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ========== USERS ==========
  console.log("👤 Creating users...");
  const users = [
    { name: "Ahmad Fauzi", email: "ahmad@gmail.com", password: "password123", role: "citizen", address: "Jl. Bojongsoang No. 45, Kec. Bojongsoang, Kab. Bandung", phone: "081234567890" },
    { name: "Siti Nurhaliza", email: "siti@gmail.com", password: "password123", role: "citizen", address: "Jl. Cipagalo No. 12, Kec. Bojongsoang, Kab. Bandung", phone: "082345678901" },
    { name: "Budi Santoso", email: "budi@gmail.com", password: "password123", role: "citizen", address: "Jl. Tegalluar No. 78, Kec. Bojongsoang, Kab. Bandung", phone: "083456789012" },
    { name: "Dewi Lestari", email: "dewi@gmail.com", password: "password123", role: "citizen", address: "Jl. Buah Batu Lama No. 100, Kec. Bojongsoang, Kab. Bandung", phone: "084567890123" },
    { name: "Eko Prasetyo", email: "eko@gmail.com", password: "password123", role: "citizen", address: "Jl. Lengkong Besar No. 55, Kec. Bojongsoang, Kab. Bandung", phone: "085678901234" },
    { name: "Admin SiDrain", email: "admin@sidrain.go.id", password: "admin123", role: "admin", address: "Kantor Kecamatan Bojongsoang, Kab. Bandung", phone: "022-5555-0000" },
  ];

  const createdUsers = [];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    const created = await prisma.user.create({
      data: { ...u, password: hashed },
    });
    createdUsers.push(created);
  }

  // ========== CATEGORIES ==========
  console.log("📂 Creating categories...");
  const categories = [
    { name: "Saluran tersumbat sampah", description: "Drainase tersumbat oleh sampah rumah tangga atau sampah lainnya" },
    { name: "Sedimentasi drainase", description: "Penumpukan lumpur atau sedimen yang menghambat aliran air" },
    { name: "Genangan air", description: "Genangan air yang tidak mengalir di area jalan atau permukiman" },
    { name: "Sungai/selokan meluap", description: "Sungai atau selokan yang meluap ke area sekitar" },
  ];

  const createdCategories = [];
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    createdCategories.push(created);
  }

  // Category ID mapping
  const catSaluran = createdCategories[0].id;   // Saluran tersumbat sampah
  const catSedimen = createdCategories[1].id;    // Sedimentasi drainase
  const catGenangan = createdCategories[2].id;   // Genangan air
  const catSungai = createdCategories[3].id;     // Sungai/selokan meluap

  // ========== REPORTS ==========
  // All locations are within Bojongsoang, Kab. Bandung area
  // Approximate bounding box: lat -6.965 to -6.995, lng 107.625 to 107.660
  console.log("📝 Creating reports...");
  const reports = [
    {
      id: "RPT-001", userId: createdUsers[0].id, categoryId: catSaluran,
      title: "Saluran air tersumbat di Jl. Bojongsoang",
      description: "Saluran air di depan rumah saya tersumbat oleh sampah plastik dan dedaunan. Air tidak mengalir dan mulai menggenang saat hujan deras.",
      photoUrl: "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
      address: "Jl. Bojongsoang No. 45, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9735, longitude: 107.6350,
      status: "Selesai", region: "Bojongsoang",
      createdAt: new Date("2025-08-10T14:30:00Z"), updatedAt: new Date("2025-08-18T10:00:00Z")
    },
    {
      id: "RPT-002", userId: createdUsers[1].id, categoryId: catGenangan,
      title: "Genangan air di pertigaan Cipagalo",
      description: "Terdapat genangan air setinggi 15cm di pertigaan Jl. Cipagalo setiap kali hujan turun. Menyebabkan kemacetan dan menyulitkan pejalan kaki.",
      photoUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
      address: "Pertigaan Jl. Cipagalo, Desa Cipagalo, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9682, longitude: 107.6412,
      status: "Diproses", region: "Bojongsoang",
      createdAt: new Date("2025-09-05T09:15:00Z"), updatedAt: new Date("2025-09-12T14:30:00Z")
    },
    {
      id: "RPT-003", userId: createdUsers[2].id, categoryId: catSedimen,
      title: "Sedimentasi parah di saluran drainase Tegalluar",
      description: "Saluran drainase di sepanjang Jl. Tegalluar mengalami sedimentasi parah. Lumpur dan pasir menumpuk sehingga aliran air sangat terhambat.",
      photoUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      address: "Jl. Tegalluar No. 78, Desa Tegalluar, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9810, longitude: 107.6480,
      status: "Diverifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-09-15T16:45:00Z"), updatedAt: new Date("2025-09-17T11:00:00Z")
    },
    {
      id: "RPT-004", userId: createdUsers[3].id, categoryId: catSungai,
      title: "Sungai Citarum meluap ke permukiman",
      description: "Sungai Citarum di belakang perumahan meluap ke jalan utama saat hujan lebat. Air sungai membawa sampah dan lumpur ke permukiman warga.",
      photoUrl: "https://images.unsplash.com/photo-1583245003700-8aa00b107d10?w=800",
      address: "Bantaran Sungai Citarum, Desa Bojongsari, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9880, longitude: 107.6320,
      status: "Menunggu Verifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-10-01T07:30:00Z"), updatedAt: new Date("2025-10-01T07:30:00Z")
    },
    {
      id: "RPT-005", userId: createdUsers[4].id, categoryId: catSaluran,
      title: "Sampah menumpuk di gorong-gorong Lengkong",
      description: "Gorong-gorong di bawah jembatan kecil tersumbat total oleh sampah. Saat hujan, air meluap dan membanjiri jalanan sekitar 30cm.",
      photoUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800",
      address: "Jl. Lengkong Besar, Desa Lengkong, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9755, longitude: 107.6290,
      status: "Diproses", region: "Bojongsoang",
      createdAt: new Date("2025-10-05T11:20:00Z"), updatedAt: new Date("2025-10-10T09:00:00Z")
    },
    {
      id: "RPT-006", userId: createdUsers[0].id, categoryId: catGenangan,
      title: "Genangan permanen di area parkir pasar Bojongsoang",
      description: "Area parkir di dekat pasar Bojongsoang selalu tergenang air meskipun tidak hujan. Diduga saluran pembuangan tersumbat di bawah tanah.",
      photoUrl: "https://images.unsplash.com/photo-1446824505046-e43605ffb17f?w=800",
      address: "Pasar Bojongsoang, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9720, longitude: 107.6370,
      status: "Selesai", region: "Bojongsoang",
      createdAt: new Date("2025-07-20T13:00:00Z"), updatedAt: new Date("2025-08-05T16:00:00Z")
    },
    {
      id: "RPT-007", userId: createdUsers[1].id, categoryId: catSaluran,
      title: "Drainase tersumbat di komplek Griya Cipagalo",
      description: "Saluran drainase utama di komplek perumahan tersumbat oleh sampah konstruksi dan plastik. Bau tidak sedap menyebar ke sekitar.",
      photoUrl: "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
      address: "Komplek Griya Cipagalo, Desa Cipagalo, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9698, longitude: 107.6445,
      status: "Ditolak", region: "Bojongsoang",
      createdAt: new Date("2025-09-25T08:45:00Z"), updatedAt: new Date("2025-09-28T14:00:00Z")
    },
    {
      id: "RPT-008", userId: createdUsers[2].id, categoryId: catSedimen,
      title: "Lumpur tebal di saluran jalan utama Tegalluar",
      description: "Saluran air di sepanjang jalan utama dipenuhi lumpur tebal hingga 20cm. Kapasitas aliran air berkurang drastis.",
      photoUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      address: "Jl. Raya Tegalluar, Desa Tegalluar, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9830, longitude: 107.6510,
      status: "Menunggu Verifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-10-12T15:30:00Z"), updatedAt: new Date("2025-10-12T15:30:00Z")
    },
    {
      id: "RPT-009", userId: createdUsers[3].id, categoryId: catSungai,
      title: "Selokan meluap dekat Perumahan Buah Batu",
      description: "Selokan di belakang rumah meluap setiap malam karena debit air meningkat. Diduga ada penyempitan saluran di hilir.",
      photoUrl: "https://images.unsplash.com/photo-1583245003700-8aa00b107d10?w=800",
      address: "Perumahan Buah Batu Regency, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9660, longitude: 107.6335,
      status: "Diproses", region: "Bojongsoang",
      createdAt: new Date("2025-10-08T19:15:00Z"), updatedAt: new Date("2025-10-14T10:00:00Z")
    },
    {
      id: "RPT-010", userId: createdUsers[4].id, categoryId: catSaluran,
      title: "Saluran air penuh sampah daun di Jl. Sapan",
      description: "Musim gugur daun menyebabkan saluran air tersumbat oleh daun-daun kering. Perlu pembersihan rutin.",
      photoUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800",
      address: "Jl. Sapan, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9780, longitude: 107.6380,
      status: "Selesai", region: "Bojongsoang",
      createdAt: new Date("2025-06-15T10:00:00Z"), updatedAt: new Date("2025-07-01T14:00:00Z")
    },
    {
      id: "RPT-011", userId: createdUsers[0].id, categoryId: catGenangan,
      title: "Genangan di depan SDN Bojongsoang 01",
      description: "Setiap hujan, area depan SDN Bojongsoang 01 selalu tergenang air hingga 10cm. Membahayakan anak-anak sekolah.",
      photoUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
      address: "SDN Bojongsoang 01, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9740, longitude: 107.6360,
      status: "Diverifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-10-15T06:30:00Z"), updatedAt: new Date("2025-10-16T09:00:00Z")
    },
    {
      id: "RPT-012", userId: createdUsers[1].id, categoryId: catSedimen,
      title: "Drainase tersedimentasi di kawasan industri Tegalluar",
      description: "Saluran drainase di kawasan industri tersedimentasi oleh limbah padat. Memerlukan pengerukan segera.",
      photoUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      address: "Kawasan Industri Tegalluar, Desa Tegalluar, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9850, longitude: 107.6550,
      status: "Menunggu Verifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-10-18T12:00:00Z"), updatedAt: new Date("2025-10-18T12:00:00Z")
    },
    {
      id: "RPT-013", userId: createdUsers[2].id, categoryId: catSungai,
      title: "Kali kecil meluap ke sawah Bojongsari",
      description: "Kali kecil di Desa Bojongsari meluap ke area sawah dan merusak tanaman petani setempat.",
      photoUrl: "https://images.unsplash.com/photo-1583245003700-8aa00b107d10?w=800",
      address: "Area Persawahan, Desa Bojongsari, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9900, longitude: 107.6280,
      status: "Selesai", region: "Bojongsoang",
      createdAt: new Date("2025-05-20T08:45:00Z"), updatedAt: new Date("2025-06-10T10:00:00Z")
    },
    {
      id: "RPT-014", userId: createdUsers[3].id, categoryId: catSaluran,
      title: "Gorong-gorong tertutup tanah di Kampung Cipagalo",
      description: "Gorong-gorong di bawah jalan kampung tertutup tanah dan puing bangunan. Air sama sekali tidak bisa mengalir.",
      photoUrl: "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
      address: "Kampung Cipagalo RT 03/05, Desa Cipagalo, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9670, longitude: 107.6430,
      status: "Diproses", region: "Bojongsoang",
      createdAt: new Date("2025-10-20T14:00:00Z"), updatedAt: new Date("2025-10-22T11:00:00Z")
    },
    {
      id: "RPT-015", userId: createdUsers[4].id, categoryId: catGenangan,
      title: "Genangan kronis di kolong jembatan Citarum",
      description: "Area di bawah jembatan Sungai Citarum selalu tergenang setiap hujan. Pompa air sepertinya tidak berfungsi optimal.",
      photoUrl: "https://images.unsplash.com/photo-1446824505046-e43605ffb17f?w=800",
      address: "Kolong Jembatan Citarum, Desa Bojongsari, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9870, longitude: 107.6300,
      status: "Diverifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-10-22T16:30:00Z"), updatedAt: new Date("2025-10-23T08:00:00Z")
    },
    {
      id: "RPT-016", userId: createdUsers[0].id, categoryId: catSedimen,
      title: "Sedimentasi berat di saluran irigasi Sapan",
      description: "Saluran irigasi yang juga berfungsi sebagai drainase mengalami sedimentasi berat. Petani dan warga terdampak.",
      photoUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      address: "Saluran Irigasi Sapan, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
      latitude: -6.9790, longitude: 107.6400,
      status: "Menunggu Verifikasi", region: "Bojongsoang",
      createdAt: new Date("2025-10-25T09:00:00Z"), updatedAt: new Date("2025-10-25T09:00:00Z")
    },
  ];

  for (const r of reports) {
    await prisma.report.create({ data: r });
  }

  // ========== REPORT UPDATES ==========
  console.log("📋 Creating report updates...");
  const updates = [
    // RPT-001 (Selesai)
    { reportId: "RPT-001", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-08-10T14:30:00Z") },
    { reportId: "RPT-001", status: "Diverifikasi", note: "Laporan telah diverifikasi. Lokasi sesuai dan masalah terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-08-12T10:00:00Z") },
    { reportId: "RPT-001", status: "Diproses", note: "Tim lapangan telah ditugaskan untuk pembersihan saluran.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-08-14T08:00:00Z") },
    { reportId: "RPT-001", status: "Selesai", note: "Saluran telah dibersihkan dan aliran air normal kembali.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-08-18T10:00:00Z") },
    // RPT-002 (Diproses)
    { reportId: "RPT-002", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-09-05T09:15:00Z") },
    { reportId: "RPT-002", status: "Diverifikasi", note: "Laporan valid. Genangan terkonfirmasi oleh petugas.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-09-08T11:00:00Z") },
    { reportId: "RPT-002", status: "Diproses", note: "Sedang dilakukan perbaikan saluran pembuangan.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-09-12T14:30:00Z") },
    // RPT-003 (Diverifikasi)
    { reportId: "RPT-003", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-09-15T16:45:00Z") },
    { reportId: "RPT-003", status: "Diverifikasi", note: "Sedimentasi terkonfirmasi. Menunggu jadwal pengerukan.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-09-17T11:00:00Z") },
    // RPT-004 (Menunggu Verifikasi)
    { reportId: "RPT-004", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-10-01T07:30:00Z") },
    // RPT-005 (Diproses)
    { reportId: "RPT-005", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-10-05T11:20:00Z") },
    { reportId: "RPT-005", status: "Diverifikasi", note: "Lokasi terkonfirmasi. Gorong-gorong memang tersumbat.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-07T09:00:00Z") },
    { reportId: "RPT-005", status: "Diproses", note: "Tim kebersihan sedang membersihkan gorong-gorong.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-10T09:00:00Z") },
    // RPT-006 (Selesai)
    { reportId: "RPT-006", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-07-20T13:00:00Z") },
    { reportId: "RPT-006", status: "Diverifikasi", note: "Genangan permanen terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-07-22T10:00:00Z") },
    { reportId: "RPT-006", status: "Diproses", note: "Dilakukan penggalian untuk perbaikan saluran bawah tanah.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-07-28T08:00:00Z") },
    { reportId: "RPT-006", status: "Selesai", note: "Perbaikan selesai. Area parkir sudah tidak tergenang.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-08-05T16:00:00Z") },
    // RPT-007 (Ditolak)
    { reportId: "RPT-007", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-09-25T08:45:00Z") },
    { reportId: "RPT-007", status: "Ditolak", note: "Laporan ditolak karena lokasi berada di area privat yang bukan tanggung jawab dinas. Silakan hubungi pengelola komplek.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-09-28T14:00:00Z") },
    // RPT-008 - RPT-016
    { reportId: "RPT-008", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-10-12T15:30:00Z") },
    { reportId: "RPT-009", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-10-08T19:15:00Z") },
    { reportId: "RPT-009", status: "Diverifikasi", note: "Masalah terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-10T09:00:00Z") },
    { reportId: "RPT-009", status: "Diproses", note: "Sedang dilakukan pelebaran saluran.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-14T10:00:00Z") },
    { reportId: "RPT-010", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-06-15T10:00:00Z") },
    { reportId: "RPT-010", status: "Diverifikasi", note: "Terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-06-17T10:00:00Z") },
    { reportId: "RPT-010", status: "Diproses", note: "Pembersihan dilakukan.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-06-25T10:00:00Z") },
    { reportId: "RPT-010", status: "Selesai", note: "Saluran bersih.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-07-01T14:00:00Z") },
    { reportId: "RPT-011", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-10-15T06:30:00Z") },
    { reportId: "RPT-011", status: "Diverifikasi", note: "Genangan depan sekolah terkonfirmasi. Prioritas tinggi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-16T09:00:00Z") },
    { reportId: "RPT-012", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updatedBy: "Sistem", updatedAt: new Date("2025-10-18T12:00:00Z") },
    { reportId: "RPT-013", status: "Menunggu Verifikasi", note: "Laporan diterima.", updatedBy: "Sistem", updatedAt: new Date("2025-05-20T08:45:00Z") },
    { reportId: "RPT-013", status: "Diverifikasi", note: "Terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-05-22T10:00:00Z") },
    { reportId: "RPT-013", status: "Diproses", note: "Penanganan dimulai.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-05-30T10:00:00Z") },
    { reportId: "RPT-013", status: "Selesai", note: "Selesai diperbaiki.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-06-10T10:00:00Z") },
    { reportId: "RPT-014", status: "Menunggu Verifikasi", note: "Laporan diterima.", updatedBy: "Sistem", updatedAt: new Date("2025-10-20T14:00:00Z") },
    { reportId: "RPT-014", status: "Diverifikasi", note: "Terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-21T09:00:00Z") },
    { reportId: "RPT-014", status: "Diproses", note: "Tim sedang menggali gorong-gorong.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-22T11:00:00Z") },
    { reportId: "RPT-015", status: "Menunggu Verifikasi", note: "Laporan diterima.", updatedBy: "Sistem", updatedAt: new Date("2025-10-22T16:30:00Z") },
    { reportId: "RPT-015", status: "Diverifikasi", note: "Masalah pompa terkonfirmasi.", updatedBy: "Admin SiDrain", updatedAt: new Date("2025-10-23T08:00:00Z") },
    { reportId: "RPT-016", status: "Menunggu Verifikasi", note: "Laporan diterima.", updatedBy: "Sistem", updatedAt: new Date("2025-10-25T09:00:00Z") },
  ];

  for (const u of updates) {
    await prisma.reportUpdate.create({ data: u });
  }

  console.log("✅ Seeding complete!");
  console.log(`   - ${createdUsers.length} users created`);
  console.log(`   - ${categories.length} categories created`);
  console.log(`   - ${reports.length} reports created`);
  console.log(`   - ${updates.length} report updates created`);
  console.log("");
  console.log("📧 Demo accounts:");
  console.log("   Warga: ahmad@gmail.com / password123");
  console.log("   Admin: admin@sidrain.go.id / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
