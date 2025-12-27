import { NextRequest, NextResponse } from 'next/server';
import { validatePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (validatePassword(password)) {
      const response = NextResponse.json({ success: true });
      response.cookies.set('auth', 'authenticated', {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
