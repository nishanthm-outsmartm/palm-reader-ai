import { NextRequest, NextResponse } from 'next/server';
import { analyzePalm } from '../../../lib/aiModels';

export async function POST(request: NextRequest) {
  try {
    const { ipfsHash } = await request.json();
    console.log('Received IPFS hash:', ipfsHash);

    const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log('Image URL:', imageUrl);

    const reading = await analyzePalm(imageUrl);
    console.log('Generated reading:', reading);

    return NextResponse.json({ reading });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in analyze API:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    } else {
      console.error('Unknown error in analyze API:', error);
      return NextResponse.json({ error: 'Internal Server Error', details: 'Unknown error' }, { status: 500 });
    }
  }
}