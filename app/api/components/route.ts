import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

type ComponentRecord = {
  id: string;
  user_id: string | null;
  type: string;
  settings: Record<string, unknown>;
  position: { x: number; y: number; w: number; h: number };
  created_at?: string;
  updated_at?: string;
};

export async function GET() {
  try {
    const sb = supabaseServer();
    const { data, error } = await sb
      .from<ComponentRecord>('components')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ components: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = String(body?.type ?? '');
    const settings = (body?.settings ?? {}) as Record<string, unknown>;
    const position = (body?.position ?? { x: 0, y: 0, w: 4, h: 3 }) as {
      x: number; y: number; w: number; h: number;
    };

    if (!type) return NextResponse.json({ error: 'Missing type' }, { status: 400 });

    const sb = supabaseServer();
    const { data, error } = await sb
      .from<ComponentRecord>('components')
      .insert({
        user_id: null, // TODO: replace with auth user id
        type,
        settings,
        position,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ component: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
