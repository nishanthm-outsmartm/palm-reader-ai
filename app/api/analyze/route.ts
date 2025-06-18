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
      temperature: 0.5,
      top_p: 0.7,
      max_tokens: 200,
    });

    const message = result.choices?.[0]?.message?.content?.trim() || 'No se pudo generar una respuesta válida.';
    console.log('📜 Lectura generada:', message);
    return NextResponse.json({ reading: message });
  } catch (error) {
    console.error('❌ Error en chatCompletion:', error);
    return NextResponse.json({ error: 'Error interno generando lectura.' }, { status: 500 });
  }
}

function buildPrompt(): string {
  return `Eres un lector de palmas místico. Alguien subió la imagen de su palma y quiere conocer su destino.

Haz una lectura que incluya lo común asociado a lectura de palmas, como el amor, la carrera, la salud y el futuro. No te limites a lo obvio, sé creativo y ofrece una visión única.
No uses frases genéricas como "todo estará bien" o "tendrás éxito". Además manten en un máximo de 200 palabras sin dejar frases incompletas.

Usa un tono cálido y empático. Puedes usar emojis si lo deseas.`;
}
