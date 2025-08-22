import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  ctx: { params: { id: string } }
) {
  const { id } = ctx.params;

  try {
    const supabase = createClient({ service: true });
    const { error } = await supabase.from("components").delete().eq("id", id);

    if (error) {
      console.error("DELETE /components/:id error", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /components/:id unexpected", e);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
