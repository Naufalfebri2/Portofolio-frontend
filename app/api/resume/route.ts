import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  try {
    const filePath = path.join(
      process.cwd(),
      "assets",
      "CV_NAUFAL_FEBRIANSYAH.pdf",
    );
    const fileBuffer = await readFile(filePath);

    // Tracking sederhana — log ke server console.
    // Nanti bisa diganti/ditambah kirim event ke Laravel API,
    // Vercel Analytics, atau database log tersendiri.
    const userAgent = request.headers.get("user-agent") ?? "unknown";
    const referer = request.headers.get("referer") ?? "direct";
    console.log(
      `[CV Download] ${new Date().toISOString()} | UA: ${userAgent} | Referer: ${referer}`,
    );

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="Naufal-Febriansyah-CV.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Gagal membaca file resume:", error);
    return NextResponse.json(
      { error: "File CV tidak ditemukan." },
      { status: 404 },
    );
  }
}
