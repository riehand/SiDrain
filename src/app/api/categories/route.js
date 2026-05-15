import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/categories — List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        created_at: c.createdAt.toISOString(),
        updated_at: c.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    );
  }
}

// POST /api/categories — Create a new category
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name: name.trim(), description: description?.trim() || "" },
    });

    return NextResponse.json({
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        created_at: category.createdAt.toISOString(),
        updated_at: category.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}
