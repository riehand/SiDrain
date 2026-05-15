import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// PUT /api/categories/[id] — Update a category
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Nama kategori wajib diisi" },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
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
    });
  } catch (error) {
    console.error("PUT category error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] — Delete a category
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
