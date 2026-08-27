import { NextResponse } from "next/server";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";

export const runtime = "nodejs";

const BUCKET = "site-media";
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, GIF or AVIF images are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Make sure the bucket exists (idempotent — no-op if it already does).
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (createError && !createError.message.includes("already exists")) {
      return NextResponse.json(
        { error: `Could not create storage bucket: ${createError.message}` },
        { status: 500 },
      );
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
}

