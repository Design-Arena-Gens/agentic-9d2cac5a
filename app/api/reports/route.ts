import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('auth');

  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reports = DataStore.getAllReports();
    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
