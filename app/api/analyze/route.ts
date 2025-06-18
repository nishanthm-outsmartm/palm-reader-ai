import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { ipfsHash } = await request.json();

    if (!ipfsHash || typeof ipfsHash !== 'string') {
      return NextResponse.json({ error: 'IPFS hash inválido.' }, { status: 400 });
    }

    const prompt = buildPrompt();

    const result = await hf.chatCompletion({
      provider: 'hf-inference',
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      top_p: 0.85,
      max_tokens: 300,
    });

    const message = result.choices?.[0]?.message?.content?.trim() || 'Could not generate a valid response. Please try again.';
    // console.log('📜 Lectura generada:', message);
    return NextResponse.json({ reading: message });
  } catch (error) {
    console.error('❌ Error en chatCompletion:', error);
    return NextResponse.json({ error: 'Error interno generando lectura.' }, { status: 500 });
  }
}

function buildPrompt(): string {
  return `You are a mystical palm reader. Someone has uploaded an image of their palm and seeks insight into their destiny.

Write a unique and insightful palm reading covering the key aspects of palmistry: love, career, health, and the future. Avoid generic phrases like "everything will be fine" or "you will be successful"—be imaginative and specific.

Your response must be fully written, without cut-off or incomplete sentences. Use a warm and empathetic tone, and feel free to include emojis to add a magical touch.

Make sure your response is between 180 and 200 words, and ends with a clear, uplifting conclusion. Each sentence should be meaningful, and the overall reading should feel complete and satisfying.`;
}
