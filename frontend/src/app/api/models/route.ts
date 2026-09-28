import { NextResponse } from 'next/server';
import { DEFAULT_AI_MODELS } from '@/lib/constants/modes';

export async function GET() {
  return NextResponse.json({
    models: DEFAULT_AI_MODELS,
    active: DEFAULT_AI_MODELS[0]
  });
}
