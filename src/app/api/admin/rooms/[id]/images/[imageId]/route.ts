import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSupabase } from "@/lib/admin-api-helpers";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { imageId } = await params;
  const { supabase, errorResponse } = requireAdminSupabase();
  if (!supabase) return errorResponse;

  const { error } = await supabase.from("room_images").delete().eq("id", imageId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/rooms");
  return NextResponse.json({ ok: true });
}

