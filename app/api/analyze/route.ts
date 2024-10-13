import { NextRequest, NextResponse } from 'next/server';
import { analyzePalm } from '../../../lib/aiModels';
import { HfInference } from '@huggingface/inference';
import { uploadToPinata } from '@/lib/pinata';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { ipfsHash } = await request.json();
    console.log('Received IPFS hash:', ipfsHash);

    const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log('Image URL:', imageUrl);

    const reading = await analyzePalm(imageUrl);
    console.log('Generated reading:', reading);

    // Generate audio from the reading
    const audioResponse = await hf.textToSpeech({
      model: "espnet/kan-bayashi_ljspeech_vits",
      inputs: reading,
    });

    // Convert AudioBuffer to Blob
    const audioBlob = new Blob([audioResponse], { type: 'audio/wav' });

    // Upload audio to Pinata
    const audioFile = new File([audioBlob], 'reading.wav', { type: 'audio/wav' });
    const audioUploadResult = await uploadToPinata(audioFile);

    return NextResponse.json({ 
      reading,
      audioIpfsHash: audioUploadResult.ipfsHash
    });
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