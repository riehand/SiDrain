import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/reports — List all reports with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("perPage") || "50");

    const where = {};

    if (status && status !== "Semua") {
      where.status = status;
    }

    if (category && category !== "all") {
      where.categoryId = parseInt(category);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { id: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.report.count({ where }),
    ]);

    return NextResponse.json({
      reports: reports.map((r) => ({
        id: r.id,
        user_id: r.userId,
        category_id: r.categoryId,
        title: r.title,
        description: r.description,
        photo_url: r.photoUrl,
        address: r.address,
        latitude: r.latitude,
        longitude: r.longitude,
        status: r.status,
        region: r.region,
        created_at: r.createdAt.toISOString(),
        updated_at: r.updatedAt.toISOString(),
        user_name: r.user.name,
        category_name: r.category.name,
      })),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("GET reports error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data laporan" },
      { status: 500 }
    );
  }
}

// POST /api/reports — Create a new report
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, category_id, description, photo_url, address, latitude, longitude, region } = body;

    if (!title || !category_id || !description || !address) {
      return NextResponse.json(
        { error: "Judul, kategori, deskripsi, dan alamat wajib diisi" },
        { status: 400 }
      );
    }

    // Generate report ID
    const lastReport = await prisma.report.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let nextNum = 1;
    if (lastReport) {
      const match = lastReport.id.match(/RPT-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1]) + 1;
      }
    }
    const reportId = `RPT-${String(nextNum).padStart(3, "0")}`;

    const report = await prisma.report.create({
      data: {
        id: reportId,
        userId: parseInt(session.user.id),
        categoryId: parseInt(category_id),
        title,
        description,
        photoUrl: photo_url || null,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: "Menunggu Verifikasi",
        region: region || "Bojongsoang",
      },
    });

    // Create initial update
    await prisma.reportUpdate.create({
      data: {
        reportId: report.id,
        status: "Menunggu Verifikasi",
        note: "Laporan diterima oleh sistem.",
        updatedBy: "Sistem",
      },
    });

    return NextResponse.json(
      {
        success: true,
        report: {
          id: report.id,
          user_id: report.userId,
          category_id: report.categoryId,
          title: report.title,
          description: report.description,
          photo_url: report.photoUrl,
          address: report.address,
          latitude: report.latitude,
          longitude: report.longitude,
          status: report.status,
          region: report.region,
          created_at: report.createdAt.toISOString(),
          updated_at: report.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST report error:", error);
    return NextResponse.json(
      { error: "Gagal membuat laporan" },
      { status: 500 }
    );
  }
}
