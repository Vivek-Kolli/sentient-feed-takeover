import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const bgName = formData.get("background");
    const file = formData.get("file");

    if (!bgName || !file) {
      return new Response(
        JSON.stringify({ error: "Missing background or file" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fileArrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);

    // Approximate "outline" using high-contrast B/W + threshold.
    const processedBuffer = await sharp(fileBuffer)
      .resize(800) // scale user image
      .greyscale()
      .threshold(220)
      .toBuffer();

    const bgPath = path.join(process.cwd(), "public", bgName.toString());
    const bgBuffer = await fs.readFile(bgPath);

    const bgMeta = await sharp(bgBuffer).metadata();

    // Resize processed image to fit background width
    const outlineResized = await sharp(processedBuffer)
      .resize({ width: bgMeta.width || 1200 })
      .png()
      .toBuffer();

    const finalImage = await sharp(bgBuffer)
      .composite([
        {
          input: outlineResized,
          blend: "over",
        },
      ])
      .png()
      .toBuffer();

    return new Response(finalImage, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "inline; filename=sentient-feed-takeover.png",
      },
    });
  } catch (err) {
    console.error("Error in /api/generate:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
