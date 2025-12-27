import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get('auth');

  if (!authCookie || authCookie.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Reinitialize data to simulate new day's activities
    DataStore.initializeMockData();
    const report = DataStore.generateDailyReport();
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
