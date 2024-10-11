import { NextRequest, NextResponse } from 'next/server';
import { analyzePalm } from '../../../lib/aiModels';

export async function POST(request: NextRequest) {
  try {
    const { ipfsHash } = await request.json();
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const reading = await analyzePalm(imageUrl);
    return NextResponse.json({ reading });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}