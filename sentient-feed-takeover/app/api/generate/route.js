import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const bg = form.get("background");
    const file = form.get("file");

    if (!bg || !file) {
      return new Response("Missing file or background", { status: 400 });
    }

    // Convert uploaded file to buffer
    const img = Buffer.from(await file.arrayBuffer());

    // Load background
    const bgPath = path.join(process.cwd(), "public", bg);
    const bgBuffer = await fs.readFile(bgPath);

    // Get background dimensions
    const bgMeta = await sharp(bgBuffer).metadata();
    const bgWidth = bgMeta.width;
    const bgHeight = bgMeta.height;

    // Process the uploaded image into outline (placeholder)
    let processed = await sharp(img)
      .greyscale()
      .threshold(220)
      .toBuffer();

    // FIX: Resize outline so it always fits
    processed = await sharp(processed)
      .resize({
        width: bgWidth,
        height: bgHeight,
        fit: "inside"
      })
      .png()
      .toBuffer();

    // Composite the resized outline onto the background
    const final = await sharp(bgBuffer)
      .composite([{ input: processed, blend: "over" }])
      .png()
      .toBuffer();

    return new Response(final, { headers: { "Content-Type": "image/png" }});
  } catch (e) {
    console.error("Error in /api/generate:", e);
    return new Response("Error generating image", { status: 500 });
  }
}
