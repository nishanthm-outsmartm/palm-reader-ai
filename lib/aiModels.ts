import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function analyzePalm(imageUrl: string): Promise<string> {
  try {
    console.log('Analyzing image:', imageUrl);

    // Paso 1: Analizar la imagen con un modelo de detección de objetos
    const objectDetectionResponse = await hf.objectDetection({
      model: "facebook/detr-resnet-50",
      data: await fetch(imageUrl).then(res => res.arrayBuffer()),
    });

    console.log('Object detection response:', JSON.stringify(objectDetectionResponse, null, 2));

    // Paso 2: Generar una descripción de la imagen
    const imageDescription = generateImageDescription(objectDetectionResponse);

    // Paso 3: Usar un modelo de generación de texto para crear la "lectura" de la palma
    const palmReading = await generatePalmReading(imageDescription);

    return palmReading;
  } catch (error) {
    console.error('Error analyzing palm:', error);
    throw error;
  }
}

interface DetectionObject {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

function generateImageDescription(detectionResult: DetectionObject[]): string {
  let description = "En esta imagen de una palma, puedo ver:";

  const hasHand = detectionResult.some((obj: DetectionObject) => obj.label === "person");
  if (hasHand) {
    description += " una mano humana con su palma visible.";
    description += " Las líneas de la palma son claramente visibles.";
    description += " Puedo distinguir la línea de la vida, la línea del corazón y la línea de la cabeza.";
    
    // Agregar detalles aleatorios para hacer la descripción más interesante
    const details = [
      "The life line appears deep and curved.",
      "The heart line is long and well-defined.",
      "The head line is straight and clear.",
      "There are several minor lines intersecting the main lines.",
      "The Mount of Venus (the base of the thumb) is prominent.",
      "The fingers are long and thin.",
      "The overall shape of the hand is rectangular.",
    ];
    
    for (let i = 0; i < 3; i++) {
      description += " " + details[Math.floor(Math.random() * details.length)];
    }
  } else {
    description += " no puedo identificar claramente una palma humana. La imagen puede no ser clara o no mostrar una palma abierta.";
  }

  return description;
}

async function generatePalmReading(imageDescription: string): Promise<string> {
  const prompt = `
You are an expert palm reader with years of experience. Based on the following description of a palm image, provide a detailed and mystical reading of the person's fortune and destiny. Be creative, use poetic and mystical language. The reading should be positive and hopeful, but also include some challenges or warnings. Speak as if you're really seeing and reading the palm directly.

Image description: ${imageDescription}

Your palm reading:`;

  try {
    const response = await hf.textGeneration({
      model: "meta-llama/Llama-2-7b-chat-hf",  // Usando Llama 2 7B Chat model
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
      }
    });

    // Limpiar y formatear la respuesta
    let cleanedReading = response.generated_text.trim();
    
    // Eliminar el prompt si está incluido en la respuesta
    const readingStart = cleanedReading.lastIndexOf("Your palm reading:");
    if (readingStart !== -1) {
      cleanedReading = cleanedReading.slice(readingStart + "Your palm reading:".length).trim();
    }

    // Limpiar cualquier texto incompleto al final
    const lastPeriodIndex = cleanedReading.lastIndexOf('.');
    if (lastPeriodIndex !== -1) {
      cleanedReading = cleanedReading.slice(0, lastPeriodIndex + 1);
    }

    return cleanedReading;

  } catch (error) {
    console.error("Error generating palm reading with Llama model:", error);
    return "I apologize, but I am unable to provide a palm reading at this time. Please try again later.";
  }
}
