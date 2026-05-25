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

// PUT /api/reports/[id] — Update report data (citizen owner only, while "Menunggu Verifikasi")
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, category_id, description, photo_url, address, latitude, longitude } = body;

    // Find existing report
    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    }

    // Check ownership
    if (existing.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: "Anda tidak memiliki akses ke laporan ini" }, { status: 403 });
    }

    // Only allow editing while still "Menunggu Verifikasi"
    if (existing.status !== "Menunggu Verifikasi") {
      return NextResponse.json(
        { error: "Laporan yang sudah diproses tidak dapat diedit" },
        { status: 400 }
      );
    }

    if (!title || !category_id || !description || !address) {
      return NextResponse.json(
        { error: "Judul, kategori, deskripsi, dan alamat wajib diisi" },
        { status: 400 }
      );
    }



    const report = await prisma.report.update({
      where: { id },
      data: {
        title,
        categoryId: parseInt(category_id),
        description,
        photoUrl: photo_url !== undefined ? photo_url : existing.photoUrl,
        address,
        latitude: latitude ? parseFloat(latitude) : existing.latitude,
        longitude: longitude ? parseFloat(longitude) : existing.longitude,
        updatedAt: new Date(),
      },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json({
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
        category_name: report.category.name,
      },
    });
  } catch (error) {
    console.error("PUT report error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui laporan" },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/[id] — Delete report (citizen owner only, while "Menunggu Verifikasi")
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
    }

    // Check ownership (admin can also delete)
    if (existing.userId !== parseInt(session.user.id) && session.user.role !== "admin") {
      return NextResponse.json({ error: "Anda tidak memiliki akses ke laporan ini" }, { status: 403 });
    }

    // Citizens can only delete while "Menunggu Verifikasi"
    if (session.user.role !== "admin" && existing.status !== "Menunggu Verifikasi") {
      return NextResponse.json(
        { error: "Laporan yang sudah diproses tidak dapat dihapus" },
        { status: 400 }
      );
    }

    // Delete related report updates first
    await prisma.reportUpdate.deleteMany({ where: { reportId: id } });

    // Delete the report
    await prisma.report.delete({ where: { id } });



    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE report error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus laporan" },
      { status: 500 }
    );
  }
}
