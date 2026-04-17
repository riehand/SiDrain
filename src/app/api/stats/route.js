import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/stats — Get report statistics
export async function GET() {
  try {
    const [
      total,
      menunggu,
      diverifikasi,
      diproses,
      selesai,
      ditolak,
      reports,
      categories,
    ] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: "Menunggu Verifikasi" } }),
      prisma.report.count({ where: { status: "Diverifikasi" } }),
      prisma.report.count({ where: { status: "Diproses" } }),
      prisma.report.count({ where: { status: "Selesai" } }),
      prisma.report.count({ where: { status: "Ditolak" } }),
      prisma.report.findMany({
        select: {
          region: true,
          categoryId: true,
          createdAt: true,
          status: true,
        },
      }),
      prisma.category.findMany({ select: { id: true, name: true } }),
    ]);

    // Region stats
    const regionCounts = {};
    reports.forEach((r) => {
      if (r.region) {
        regionCounts[r.region] = (regionCounts[r.region] || 0) + 1;
      }
    });
    const regionStats = Object.entries(regionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Category stats
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.id] = c.name;
    });
    const catCounts = {};
    reports.forEach((r) => {
      const name = catMap[r.categoryId] || "Lainnya";
      catCounts[name] = (catCounts[name] || 0) + 1;
    });
    const categoryStats = Object.entries(catCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Monthly data
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const monthCounts = new Array(12).fill(0);
    reports.forEach((r) => {
      const month = new Date(r.createdAt).getMonth();
      monthCounts[month]++;
    });
    const monthlyData = months.map((name, i) => ({ name, laporan: monthCounts[i] }));

    // Status chart data
    const statusData = [
      { name: "Menunggu", value: menunggu, fill: "#9ca3af" },
      { name: "Diverifikasi", value: diverifikasi, fill: "#3b82f6" },
      { name: "Diproses", value: diproses, fill: "#f59e0b" },
      { name: "Selesai", value: selesai, fill: "#22c55e" },
      { name: "Ditolak", value: ditolak, fill: "#ef4444" },
    ];

    return NextResponse.json({
      total,
      menunggu,
      diverifikasi,
      diproses,
      selesai,
      ditolak,
      regionStats,
      categoryStats,
      monthlyData,
      statusData,
    });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 }
    );
  }
}
