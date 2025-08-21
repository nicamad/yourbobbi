import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  const intentIsSales = /sales|revenue/i.test(message ?? '');
  const answer = intentIsSales
    ? "Your sales last 7 days were $12,430."
    : "I can help with sales, revenue, or expenses. Ask me anything!";

  const suggestedComponent = intentIsSales
    ? {
        type: 'sales_overview',
        title: 'Sales (Last 7 Days)',
        dataSource: 'shopify', // later detect connected system
        settings: { range: '7d', visualization: 'line' }
      }
    : null;

  return NextResponse.json({ ok: true, answer, suggestedComponent });
}
