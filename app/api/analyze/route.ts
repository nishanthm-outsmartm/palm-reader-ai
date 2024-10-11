import { NextRequest, NextResponse } from 'next/server';
import { analyzePalm } from '../../../lib/aiModels';

export async function POST(request: NextRequest) {
  try {
    const { ipfsHash } = await request.json();
    const reading = await analyzePalm(ipfsHash);
    return NextResponse.json({ reading });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}