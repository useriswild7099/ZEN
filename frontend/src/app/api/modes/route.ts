import { NextResponse } from 'next/server';
import { ALL_CHAT_MODES } from '@/lib/constants/modes';

export async function GET() {
  return NextResponse.json({
    modes: ALL_CHAT_MODES
  });
}
