import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createClient({ service: true });
    const { data, error } = await supabase
      .from("components")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, components: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { type, settings, position }
    const supabase = createClient({ service: true });
    const { data, error } = await supabase
      .from("components")
      .insert({
        type: body.type,
        settings: body.settings ?? {},
        position: body.position ?? { x: 0, y: 0, w: 4, h: 3 },
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, component: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unexpected error" }, { status: 500 });
  }
}
