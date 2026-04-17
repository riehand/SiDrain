import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/reports/user — Get reports for the logged-in user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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
        category_name: r.category.name,
      })),
    });
  } catch (error) {
    console.error("GET user reports error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil laporan pengguna" },
      { status: 500 }
    );
  }
}
