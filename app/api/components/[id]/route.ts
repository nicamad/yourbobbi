import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing component id" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("components").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
