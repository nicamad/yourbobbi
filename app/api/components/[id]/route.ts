import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

async function getUserId(req: Request) {
  const headerId = req.headers.get('x-mock-user-id');
  if (headerId) return headerId;
  const envId = process.env.NEXT_PUBLIC_MOCK_USER_ID;
  if (envId) return envId;
  throw new Error('Unauthenticated');
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId(req);
    const updates = await req.json(); // e.g., { position, settings, title }
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('components')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, component: data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 401 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId(req);
    const supabase = supabaseServer();
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 401 });
  }
}
