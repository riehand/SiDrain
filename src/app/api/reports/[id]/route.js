import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/reports/[id] — Get report detail with updates
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true },
        },
        updates: {
          orderBy: { updatedAt: "asc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
        user_name: report.user.name,
        category_name: report.category.name,
      },
      updates: report.updates.map((u) => ({
        id: u.id,
        report_id: u.reportId,
        status: u.status,
        note: u.note,
        updated_by: u.updatedBy,
        updated_at: u.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET report detail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail laporan" },
      { status: 500 }
    );
  }
}

// PATCH /api/reports/[id] — Update report status (admin only)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, note, updated_by } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status wajib diisi" },
        { status: 400 }
      );
    }

    // Update report
    const report = await prisma.report.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    // Create update record
    const update = await prisma.reportUpdate.create({
      data: {
        reportId: id,
        status,
        note: note || `Status diperbarui ke ${status}`,
        updatedBy: updated_by || session.user.name || "Admin SiDrain",
      },
    });

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        status: report.status,
        updated_at: report.updatedAt.toISOString(),
      },
      update: {
        id: update.id,
        report_id: update.reportId,
        status: update.status,
        note: update.note,
        updated_by: update.updatedBy,
        updated_at: update.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PATCH report error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status laporan" },
      { status: 500 }
    );
  }
}
