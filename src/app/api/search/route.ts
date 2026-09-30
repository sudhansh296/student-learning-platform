import { NextResponse } from 'next/server';
import { searchLessons } from '@/lib/searchIndex';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q') || '';
  if (q.trim().length < 2 || q.length > 80) return NextResponse.json({ results: [], corrected: null, marks: [] });
  return NextResponse.json(searchLessons(q));
}
