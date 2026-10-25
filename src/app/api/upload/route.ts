import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Format file size
    const sizeInBytes = file.size;
    const formattedSize =
      sizeInBytes >= 1024 * 1024
        ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(sizeInBytes / 1024)} KB`;

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Clean and sanitize filename
    const timestamp = Date.now();
    const originalName = file.name || "document.pdf";
    const extension = path.extname(originalName) || ".pdf";
    const baseName = path.basename(originalName, extension).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFileName = `${timestamp}_${baseName}${extension}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    // Save to public/uploads directory
    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: originalName,
      fileSize: formattedSize,
      mimeType: file.type || "application/octet-stream",
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan file ke server", details: String(error) },
      { status: 500 }
    );
  }
}
