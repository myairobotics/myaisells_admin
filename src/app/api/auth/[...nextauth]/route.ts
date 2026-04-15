import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { handlers } from '@/libs/auth';

export async function GET(req: NextRequest) {
  try {
    return await handlers.GET(req);
  } catch (error: any) {
    console.error('[NextAuth GET] Unhandled error:', error?.message || error, error?.stack);
    return NextResponse.json(
      { error: 'Internal auth error', detail: error?.message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handlers.POST(req);
  } catch (error: any) {
    console.error('[NextAuth POST] Unhandled error:', error?.message || error, error?.stack);
    return NextResponse.json(
      { error: 'Internal auth error', detail: error?.message },
      { status: 500 },
    );
  }
}
