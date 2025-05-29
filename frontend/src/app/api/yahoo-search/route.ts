import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }
  try {
    const yahooRes = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}`);
    if (!yahooRes.ok) {
      return NextResponse.json({ error: 'Yahoo API error' }, { status: 502 });
    }
    const data = await yahooRes.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 