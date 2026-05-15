// ========== USERS ==========
export const users = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    email: "ahmad@gmail.com",
    password: "password123",
    role: "citizen",
    address: "Jl. Bojongsoang No. 45, Kec. Bojongsoang, Kab. Bandung",
    phone: "081234567890",
    created_at: "2025-01-15T08:00:00Z",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti@gmail.com",
    password: "password123",
    role: "citizen",
    address: "Jl. Cipagalo No. 12, Kec. Bojongsoang, Kab. Bandung",
    phone: "082345678901",
    created_at: "2025-02-10T09:00:00Z",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@gmail.com",
    password: "password123",
    role: "citizen",
    address: "Jl. Tegalluar No. 78, Kec. Bojongsoang, Kab. Bandung",
    phone: "083456789012",
    created_at: "2025-02-20T10:00:00Z",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@gmail.com",
    password: "password123",
    role: "citizen",
    address: "Jl. Buah Batu Lama No. 100, Kec. Bojongsoang, Kab. Bandung",
    phone: "084567890123",
    created_at: "2025-03-05T11:00:00Z",
  },
  {
    id: 5,
    name: "Eko Prasetyo",
    email: "eko@gmail.com",
    password: "password123",
    role: "citizen",
    address: "Jl. Lengkong Besar No. 55, Kec. Bojongsoang, Kab. Bandung",
    phone: "085678901234",
    created_at: "2025-03-15T12:00:00Z",
  },
  {
    id: 6,
    name: "Admin SiDrain",
    email: "admin@sidrain.go.id",
    password: "admin123",
    role: "admin",
    address: "Kantor Kecamatan Bojongsoang, Kab. Bandung",
    phone: "022-5555-0000",
    created_at: "2025-01-01T08:00:00Z",
  },
];

// ========== CATEGORIES ==========
export const categories = [
  { id: 1, name: "Saluran tersumbat sampah", description: "Drainase tersumbat oleh sampah rumah tangga atau sampah lainnya", created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-01T08:00:00Z" },
  { id: 2, name: "Sedimentasi drainase", description: "Penumpukan lumpur atau sedimen yang menghambat aliran air", created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-01T08:00:00Z" },
  { id: 3, name: "Genangan air", description: "Genangan air yang tidak mengalir di area jalan atau permukiman", created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-01T08:00:00Z" },
  { id: 4, name: "Sungai/selokan meluap", description: "Sungai atau selokan yang meluap ke area sekitar", created_at: "2025-01-01T08:00:00Z", updated_at: "2025-01-01T08:00:00Z" },
];

// ========== REPORTS ==========
export const reports = [
  {
    id: "RPT-001",
    user_id: 1,
    category_id: 1,
    title: "Saluran air tersumbat di Jl. Bojongsoang",
    description: "Saluran air di depan rumah saya tersumbat oleh sampah plastik dan dedaunan. Air tidak mengalir dan mulai menggenang saat hujan deras.",
    photo_url: "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
    address: "Jl. Bojongsoang No. 45, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9735,
    longitude: 107.6350,
    status: "Selesai",
    created_at: "2025-08-10T14:30:00Z",
    updated_at: "2025-08-18T10:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-002",
    user_id: 2,
    category_id: 3,
    title: "Genangan air di pertigaan Cipagalo",
    description: "Terdapat genangan air setinggi 15cm di pertigaan Jl. Cipagalo setiap kali hujan turun. Menyebabkan kemacetan dan menyulitkan pejalan kaki.",
    photo_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
    address: "Pertigaan Jl. Cipagalo, Desa Cipagalo, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9682,
    longitude: 107.6412,
    status: "Diproses",
    created_at: "2025-09-05T09:15:00Z",
    updated_at: "2025-09-12T14:30:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-003",
    user_id: 3,
    category_id: 2,
    title: "Sedimentasi parah di saluran drainase Tegalluar",
    description: "Saluran drainase di sepanjang Jl. Tegalluar mengalami sedimentasi parah. Lumpur dan pasir menumpuk sehingga aliran air sangat terhambat.",
    photo_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    address: "Jl. Tegalluar No. 78, Desa Tegalluar, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9810,
    longitude: 107.6480,
    status: "Diverifikasi",
    created_at: "2025-09-15T16:45:00Z",
    updated_at: "2025-09-17T11:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-004",
    user_id: 4,
    category_id: 4,
    title: "Sungai Citarum meluap ke permukiman",
    description: "Sungai Citarum di belakang perumahan meluap ke jalan utama saat hujan lebat. Air sungai membawa sampah dan lumpur ke permukiman warga.",
    photo_url: "https://images.unsplash.com/photo-1583245003700-8aa00b107d10?w=800",
    address: "Bantaran Sungai Citarum, Desa Bojongsari, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9880,
    longitude: 107.6320,
    status: "Menunggu Verifikasi",
    created_at: "2025-10-01T07:30:00Z",
    updated_at: "2025-10-01T07:30:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-005",
    user_id: 5,
    category_id: 1,
    title: "Sampah menumpuk di gorong-gorong Lengkong",
    description: "Gorong-gorong di bawah jembatan kecil tersumbat total oleh sampah. Saat hujan, air meluap dan membanjiri jalanan sekitar 30cm.",
    photo_url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800",
    address: "Jl. Lengkong Besar, Desa Lengkong, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9755,
    longitude: 107.6290,
    status: "Diproses",
    created_at: "2025-10-05T11:20:00Z",
    updated_at: "2025-10-10T09:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-006",
    user_id: 1,
    category_id: 3,
    title: "Genangan permanen di area parkir pasar Bojongsoang",
    description: "Area parkir di dekat pasar Bojongsoang selalu tergenang air meskipun tidak hujan. Diduga saluran pembuangan tersumbat di bawah tanah.",
    photo_url: "https://images.unsplash.com/photo-1446824505046-e43605ffb17f?w=800",
    address: "Pasar Bojongsoang, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9720,
    longitude: 107.6370,
    status: "Selesai",
    created_at: "2025-07-20T13:00:00Z",
    updated_at: "2025-08-05T16:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-007",
    user_id: 2,
    category_id: 1,
    title: "Drainase tersumbat di komplek Griya Cipagalo",
    description: "Saluran drainase utama di komplek perumahan tersumbat oleh sampah konstruksi dan plastik. Bau tidak sedap menyebar ke sekitar.",
    photo_url: "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
    address: "Komplek Griya Cipagalo, Desa Cipagalo, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9698,
    longitude: 107.6445,
    status: "Ditolak",
    created_at: "2025-09-25T08:45:00Z",
    updated_at: "2025-09-28T14:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-008",
    user_id: 3,
    category_id: 2,
    title: "Lumpur tebal di saluran jalan utama Tegalluar",
    description: "Saluran air di sepanjang jalan utama dipenuhi lumpur tebal hingga 20cm. Kapasitas aliran air berkurang drastis.",
    photo_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    address: "Jl. Raya Tegalluar, Desa Tegalluar, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9830,
    longitude: 107.6510,
    status: "Menunggu Verifikasi",
    created_at: "2025-10-12T15:30:00Z",
    updated_at: "2025-10-12T15:30:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-009",
    user_id: 4,
    category_id: 4,
    title: "Selokan meluap dekat Perumahan Buah Batu",
    description: "Selokan di belakang rumah meluap setiap malam karena debit air meningkat. Diduga ada penyempitan saluran di hilir.",
    photo_url: "https://images.unsplash.com/photo-1583245003700-8aa00b107d10?w=800",
    address: "Perumahan Buah Batu Regency, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9660,
    longitude: 107.6335,
    status: "Diproses",
    created_at: "2025-10-08T19:15:00Z",
    updated_at: "2025-10-14T10:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-010",
    user_id: 5,
    category_id: 1,
    title: "Saluran air penuh sampah daun di Jl. Sapan",
    description: "Musim gugur daun menyebabkan saluran air tersumbat oleh daun-daun kering. Perlu pembersihan rutin.",
    photo_url: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800",
    address: "Jl. Sapan, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9780,
    longitude: 107.6380,
    status: "Selesai",
    created_at: "2025-06-15T10:00:00Z",
    updated_at: "2025-07-01T14:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-011",
    user_id: 1,
    category_id: 3,
    title: "Genangan di depan SDN Bojongsoang 01",
    description: "Setiap hujan, area depan SDN Bojongsoang 01 selalu tergenang air hingga 10cm. Membahayakan anak-anak sekolah.",
    photo_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
    address: "SDN Bojongsoang 01, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9740,
    longitude: 107.6360,
    status: "Diverifikasi",
    created_at: "2025-10-15T06:30:00Z",
    updated_at: "2025-10-16T09:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-012",
    user_id: 2,
    category_id: 2,
    title: "Drainase tersedimentasi di kawasan industri Tegalluar",
    description: "Saluran drainase di kawasan industri tersedimentasi oleh limbah padat. Memerlukan pengerukan segera.",
    photo_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    address: "Kawasan Industri Tegalluar, Desa Tegalluar, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9850,
    longitude: 107.6550,
    status: "Menunggu Verifikasi",
    created_at: "2025-10-18T12:00:00Z",
    updated_at: "2025-10-18T12:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-013",
    user_id: 3,
    category_id: 4,
    title: "Kali kecil meluap ke sawah Bojongsari",
    description: "Kali kecil di Desa Bojongsari meluap ke area sawah dan merusak tanaman petani setempat.",
    photo_url: "https://images.unsplash.com/photo-1583245003700-8aa00b107d10?w=800",
    address: "Area Persawahan, Desa Bojongsari, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9900,
    longitude: 107.6280,
    status: "Selesai",
    created_at: "2025-05-20T08:45:00Z",
    updated_at: "2025-06-10T10:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-014",
    user_id: 4,
    category_id: 1,
    title: "Gorong-gorong tertutup tanah di Kampung Cipagalo",
    description: "Gorong-gorong di bawah jalan kampung tertutup tanah dan puing bangunan. Air sama sekali tidak bisa mengalir.",
    photo_url: "https://images.unsplash.com/photo-1584824388878-ca05cd30e8dd?w=800",
    address: "Kampung Cipagalo RT 03/05, Desa Cipagalo, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9670,
    longitude: 107.6430,
    status: "Diproses",
    created_at: "2025-10-20T14:00:00Z",
    updated_at: "2025-10-22T11:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-015",
    user_id: 5,
    category_id: 3,
    title: "Genangan kronis di kolong jembatan Citarum",
    description: "Area di bawah jembatan Sungai Citarum selalu tergenang setiap hujan. Pompa air sepertinya tidak berfungsi optimal.",
    photo_url: "https://images.unsplash.com/photo-1446824505046-e43605ffb17f?w=800",
    address: "Kolong Jembatan Citarum, Desa Bojongsari, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9870,
    longitude: 107.6300,
    status: "Diverifikasi",
    created_at: "2025-10-22T16:30:00Z",
    updated_at: "2025-10-23T08:00:00Z",
    region: "Bojongsoang"
  },
  {
    id: "RPT-016",
    user_id: 1,
    category_id: 2,
    title: "Sedimentasi berat di saluran irigasi Sapan",
    description: "Saluran irigasi yang juga berfungsi sebagai drainase mengalami sedimentasi berat. Petani dan warga terdampak.",
    photo_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
    address: "Saluran Irigasi Sapan, Desa Bojongsoang, Kec. Bojongsoang, Kab. Bandung",
    latitude: -6.9790,
    longitude: 107.6400,
    status: "Menunggu Verifikasi",
    created_at: "2025-10-25T09:00:00Z",
    updated_at: "2025-10-25T09:00:00Z",
    region: "Bojongsoang"
  },
];

// ========== REPORT UPDATES (Timeline) ==========
export const reportUpdates = [
  // RPT-001 (Selesai)
  { id: 1, report_id: "RPT-001", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-08-10T14:30:00Z" },
  { id: 2, report_id: "RPT-001", status: "Diverifikasi", note: "Laporan telah diverifikasi. Lokasi sesuai dan masalah terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-08-12T10:00:00Z" },
  { id: 3, report_id: "RPT-001", status: "Diproses", note: "Tim lapangan telah ditugaskan untuk pembersihan saluran.", updated_by: "Admin SiDrain", updated_at: "2025-08-14T08:00:00Z" },
  { id: 4, report_id: "RPT-001", status: "Selesai", note: "Saluran telah dibersihkan dan aliran air normal kembali.", updated_by: "Admin SiDrain", updated_at: "2025-08-18T10:00:00Z" },

  // RPT-002 (Diproses)
  { id: 5, report_id: "RPT-002", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-09-05T09:15:00Z" },
  { id: 6, report_id: "RPT-002", status: "Diverifikasi", note: "Laporan valid. Genangan terkonfirmasi oleh petugas.", updated_by: "Admin SiDrain", updated_at: "2025-09-08T11:00:00Z" },
  { id: 7, report_id: "RPT-002", status: "Diproses", note: "Sedang dilakukan perbaikan saluran pembuangan.", updated_by: "Admin SiDrain", updated_at: "2025-09-12T14:30:00Z" },

  // RPT-003 (Diverifikasi)
  { id: 8, report_id: "RPT-003", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-09-15T16:45:00Z" },
  { id: 9, report_id: "RPT-003", status: "Diverifikasi", note: "Sedimentasi terkonfirmasi. Menunggu jadwal pengerukan.", updated_by: "Admin SiDrain", updated_at: "2025-09-17T11:00:00Z" },

  // RPT-004 (Menunggu Verifikasi)
  { id: 10, report_id: "RPT-004", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-10-01T07:30:00Z" },

  // RPT-005 (Diproses)
  { id: 11, report_id: "RPT-005", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-10-05T11:20:00Z" },
  { id: 12, report_id: "RPT-005", status: "Diverifikasi", note: "Lokasi terkonfirmasi. Gorong-gorong memang tersumbat.", updated_by: "Admin SiDrain", updated_at: "2025-10-07T09:00:00Z" },
  { id: 13, report_id: "RPT-005", status: "Diproses", note: "Tim kebersihan sedang membersihkan gorong-gorong.", updated_by: "Admin SiDrain", updated_at: "2025-10-10T09:00:00Z" },

  // RPT-006 (Selesai)
  { id: 14, report_id: "RPT-006", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-07-20T13:00:00Z" },
  { id: 15, report_id: "RPT-006", status: "Diverifikasi", note: "Genangan permanen terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-07-22T10:00:00Z" },
  { id: 16, report_id: "RPT-006", status: "Diproses", note: "Dilakukan penggalian untuk perbaikan saluran bawah tanah.", updated_by: "Admin SiDrain", updated_at: "2025-07-28T08:00:00Z" },
  { id: 17, report_id: "RPT-006", status: "Selesai", note: "Perbaikan selesai. Area parkir sudah tidak tergenang.", updated_by: "Admin SiDrain", updated_at: "2025-08-05T16:00:00Z" },

  // RPT-007 (Ditolak)
  { id: 18, report_id: "RPT-007", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-09-25T08:45:00Z" },
  { id: 19, report_id: "RPT-007", status: "Ditolak", note: "Laporan ditolak karena lokasi berada di area privat yang bukan tanggung jawab dinas. Silakan hubungi pengelola komplek.", updated_by: "Admin SiDrain", updated_at: "2025-09-28T14:00:00Z" },

  // RPT-008 - RPT-016 (simple entries)
  { id: 20, report_id: "RPT-008", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-10-12T15:30:00Z" },
  { id: 21, report_id: "RPT-009", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-10-08T19:15:00Z" },
  { id: 22, report_id: "RPT-009", status: "Diverifikasi", note: "Masalah terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-10-10T09:00:00Z" },
  { id: 23, report_id: "RPT-009", status: "Diproses", note: "Sedang dilakukan pelebaran saluran.", updated_by: "Admin SiDrain", updated_at: "2025-10-14T10:00:00Z" },
  { id: 24, report_id: "RPT-010", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-06-15T10:00:00Z" },
  { id: 25, report_id: "RPT-010", status: "Diverifikasi", note: "Terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-06-17T10:00:00Z" },
  { id: 26, report_id: "RPT-010", status: "Diproses", note: "Pembersihan dilakukan.", updated_by: "Admin SiDrain", updated_at: "2025-06-25T10:00:00Z" },
  { id: 27, report_id: "RPT-010", status: "Selesai", note: "Saluran bersih.", updated_by: "Admin SiDrain", updated_at: "2025-07-01T14:00:00Z" },
  { id: 28, report_id: "RPT-011", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-10-15T06:30:00Z" },
  { id: 29, report_id: "RPT-011", status: "Diverifikasi", note: "Genangan depan sekolah terkonfirmasi. Prioritas tinggi.", updated_by: "Admin SiDrain", updated_at: "2025-10-16T09:00:00Z" },
  { id: 30, report_id: "RPT-012", status: "Menunggu Verifikasi", note: "Laporan diterima oleh sistem.", updated_by: "Sistem", updated_at: "2025-10-18T12:00:00Z" },
  { id: 31, report_id: "RPT-013", status: "Menunggu Verifikasi", note: "Laporan diterima.", updated_by: "Sistem", updated_at: "2025-05-20T08:45:00Z" },
  { id: 32, report_id: "RPT-013", status: "Diverifikasi", note: "Terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-05-22T10:00:00Z" },
  { id: 33, report_id: "RPT-013", status: "Diproses", note: "Penanganan dimulai.", updated_by: "Admin SiDrain", updated_at: "2025-05-30T10:00:00Z" },
  { id: 34, report_id: "RPT-013", status: "Selesai", note: "Selesai diperbaiki.", updated_by: "Admin SiDrain", updated_at: "2025-06-10T10:00:00Z" },
  { id: 35, report_id: "RPT-014", status: "Menunggu Verifikasi", note: "Laporan diterima.", updated_by: "Sistem", updated_at: "2025-10-20T14:00:00Z" },
  { id: 36, report_id: "RPT-014", status: "Diverifikasi", note: "Terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-10-21T09:00:00Z" },
  { id: 37, report_id: "RPT-014", status: "Diproses", note: "Tim sedang menggali gorong-gorong.", updated_by: "Admin SiDrain", updated_at: "2025-10-22T11:00:00Z" },
  { id: 38, report_id: "RPT-015", status: "Menunggu Verifikasi", note: "Laporan diterima.", updated_by: "Sistem", updated_at: "2025-10-22T16:30:00Z" },
  { id: 39, report_id: "RPT-015", status: "Diverifikasi", note: "Masalah pompa terkonfirmasi.", updated_by: "Admin SiDrain", updated_at: "2025-10-23T08:00:00Z" },
  { id: 40, report_id: "RPT-016", status: "Menunggu Verifikasi", note: "Laporan diterima.", updated_by: "Sistem", updated_at: "2025-10-25T09:00:00Z" },
];

// ========== HELPER FUNCTIONS ==========

export function getReportsByUser(userId) {
  return reports.filter(r => r.user_id === userId);
}

export function getReportById(reportId) {
  return reports.find(r => r.id === reportId);
}

export function getReportUpdates(reportId) {
  return reportUpdates.filter(u => u.report_id === reportId).sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
}

export function getUserById(userId) {
  return users.find(u => u.id === userId);
}

export function getCategoryById(categoryId) {
  return categories.find(c => c.id === categoryId);
}

export function getCategoryName(categoryId) {
  const cat = getCategoryById(categoryId);
  return cat ? cat.name : 'Tidak Diketahui';
}

export function getUserName(userId) {
  const user = getUserById(userId);
  return user ? user.name : 'Tidak Diketahui';
}

// Stats helpers
export function getStats() {
  const total = reports.length;
  const menunggu = reports.filter(r => r.status === 'Menunggu Verifikasi').length;
  const diverifikasi = reports.filter(r => r.status === 'Diverifikasi').length;
  const diproses = reports.filter(r => r.status === 'Diproses').length;
  const selesai = reports.filter(r => r.status === 'Selesai').length;
  const ditolak = reports.filter(r => r.status === 'Ditolak').length;
  return { total, menunggu, diverifikasi, diproses, selesai, ditolak };
}

export function getRegionStats() {
  const regionCounts = {};
  reports.forEach(r => {
    regionCounts[r.region] = (regionCounts[r.region] || 0) + 1;
  });
  return Object.entries(regionCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCategoryStats() {
  const catCounts = {};
  reports.forEach(r => {
    const catName = getCategoryName(r.category_id);
    catCounts[catName] = (catCounts[catName] || 0) + 1;
  });
  return Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMonthlyData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthCounts = new Array(12).fill(0);
  reports.forEach(r => {
    const month = new Date(r.created_at).getMonth();
    monthCounts[month]++;
  });
  return months.map((name, i) => ({ name, laporan: monthCounts[i] }));
}

export function getStatusData() {
  const stats = getStats();
  return [
    { name: 'Menunggu', value: stats.menunggu, fill: '#9ca3af' },
    { name: 'Diverifikasi', value: stats.diverifikasi, fill: '#3b82f6' },
    { name: 'Diproses', value: stats.diproses, fill: '#f59e0b' },
    { name: 'Selesai', value: stats.selesai, fill: '#22c55e' },
    { name: 'Ditolak', value: stats.ditolak, fill: '#ef4444' },
  ];
}
