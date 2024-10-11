import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function analyzePalm(ipfsHash: string): Promise<string> {
  const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this palm image and provide a fortune-telling reading based on what you see. Be creative and mystical in your interpretation." },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
    });

    return response.choices[0].message.content || 'No reading available';
  } catch (error) {
    console.error('Error analyzing palm with AI:', error);
    throw error;
  }
}