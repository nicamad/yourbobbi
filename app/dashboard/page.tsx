import { supabaseServer } from '@/lib/supabase';

export default async function DashboardPage() {
  const userId = process.env.NEXT_PUBLIC_MOCK_USER_ID; // dev-only until real auth

  if (!userId) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold mb-2">Your dashboard</h1>
        <p className="text-sm text-gray-500">No user set. For dev, set NEXT_PUBLIC_MOCK_USER_ID in Vercel env and redeploy.</p>
      </main>
    );
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    return <main className="p-8 text-red-600">Error: {error.message}</main>;
  }

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Your dashboard</h1>
      {!data?.length ? (
        <p className="text-gray-500">No components yet. Ask Bobbi to pin something.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((c: any) => (
            <div key={c.id} className="rounded-2xl border p-4">
              <h2 className="font-medium mb-2">{c.title}</h2>
              <div className="text-xs text-gray-500 mb-2">Source: {c.data_source}</div>
              <pre className="text-xs bg-gray-50 p-3 rounded">{JSON.stringify(c.settings, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
