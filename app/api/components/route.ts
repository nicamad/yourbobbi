import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// TODO: replace with real auth. For MVP you can pass X-Mock-User-Id from the client or set NEXT_PUBLIC_MOCK_USER_ID.
async function getUserId(req: Request) {
  const headerId = req.headers.get('x-mock-user-id');
  if (headerId) return headerId;
  const envId = process.env.NEXT_PUBLIC_MOCK_USER_ID;
  if (envId) return envId;
  throw new Error('Unauthenticated');
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, components: data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    const { type, title, dataSource, settings } = await req.json();

    if (!type || !title || !dataSource) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('components')
      .insert({
        user_id: userId,
        type,
        title,
        data_source: dataSource,
        settings: settings ?? {},
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, component: data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 401 });
  }
}
