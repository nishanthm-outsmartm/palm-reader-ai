import { NextRequest, NextResponse } from 'next/server';
import { uploadToPinata } from '@/lib/pinata';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const result = await uploadToPinata(file);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in upload API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}