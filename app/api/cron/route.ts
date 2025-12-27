import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/mockData';

// This endpoint can be called by Vercel Cron or external scheduler
export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'dev-cron-secret';

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Generate daily report
    DataStore.initializeMockData();
    const report = DataStore.generateDailyReport();

    // In production, you would:
    // 1. Save report to database
    // 2. Send email notification
    // 3. Generate PDF document
    // 4. Store in cloud storage

    return NextResponse.json({
      success: true,
      message: 'Daily report generated successfully',
      reportId: report.id,
      date: report.date,
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
