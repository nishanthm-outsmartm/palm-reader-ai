import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function analyzePalm(imageUrl: string): Promise<string> {
  try {
    console.log('🔍 Starting palm analysis for:', imageUrl);

    // Verificar que la imagen sea accesible primero
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    console.log('✅ Image accessible, type:', contentType, 'size:', imageResponse.headers.get('content-length'));

    // Convertir a Blob
    const arrayBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([arrayBuffer], { type: contentType });
    console.log('📦 Blob created, size:', imageBlob.size);

    // Verificar que tenemos API key
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('Hugging Face API key not found');
    }

    console.log('🤖 Attempting object detection...');

    let objectDetectionResponse;
    try {
      objectDetectionResponse = await hf.objectDetection({
        model: "facebook/detr-resnet-50",
        data: imageBlob,
      });
      console.log('✅ Object detection successful:', JSON.stringify(objectDetectionResponse, null, 2));
    } catch (fbError) {
      console.error('❌ Facebook model failed:', fbError);

      // Fallback a un modelo más simple
      console.log('🔄 Trying fallback model...');
      try {
        objectDetectionResponse = await hf.objectDetection({
          model: "hustvl/yolos-tiny",
          data: imageBlob,
        });
        console.log('✅ Fallback model successful:', JSON.stringify(objectDetectionResponse, null, 2));
      } catch (fallbackError) {
        console.error('❌ Fallback model also failed:', fallbackError);
        console.log('🎲 Using generic description due to model failures');
        return generateGenericPalmReading();
      }
    }

    const imageDescription = generateImageDescription(objectDetectionResponse);
    console.log('📝 Generated description:', imageDescription);

    const palmReading = await generatePalmReading(imageDescription);
    console.log('🔮 Generated palm reading:', palmReading);

    return palmReading;

  } catch (error) {
    console.error('💥 Error in analyzePalm:', error);
    return generateGenericPalmReading();
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
  if (!Array.isArray(detectionResult)) {
    console.warn('❗ Invalid detection result:', detectionResult);
    return "No se pudo analizar correctamente la imagen, pero haré una lectura basada en la energía que transmite.";
  }

  console.log('🏷️ Processing detection results:', detectionResult.length, 'objects found');

  const relevantObjects = detectionResult.filter(obj =>
    obj.label?.toLowerCase().includes('person') ||
    obj.label?.toLowerCase().includes('hand') ||
    obj.score > 0.5
  );

  console.log('🎯 Relevant objects:', relevantObjects.map(obj => `${obj.label} (${obj.score.toFixed(2)})`));

  if (relevantObjects.length > 0) {
    return "En esta imagen puedo detectar elementos que sugieren la presencia de una mano humana. Las líneas de la palma están presentes y visibles. Puedo distinguir las características principales necesarias para una lectura de palma.";
  } else {
    return "En esta imagen, aunque no puedo detectar específicamente una mano, procederé con una lectura basada en la energía que transmite la imagen.";
  }
}

async function generatePalmReading(imageDescription: string): Promise<string> {
  const prompt = `Como experto lector de palmas, basándome en: "${imageDescription}", 
  proporciona una lectura mística que incluya:
  - Líneas principales (vida, corazón, cabeza)
  - Personalidad y rasgos
  - Predicciones positivas
  - Un mensaje inspirador

  Lectura:`;

  try {
    console.log('📝 Generating text with Llama model...');

    const response = await hf.textGeneration({
      model: "tiiuae/falcon-7b-instruct",
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.8,
        top_p: 0.9,
        repetition_penalty: 1.1,
      }
    });

    let cleanedReading = response.generated_text.trim();

    const readingStart = cleanedReading.lastIndexOf("Lectura:");
    if (readingStart !== -1) {
      cleanedReading = cleanedReading.slice(readingStart + "Lectura:".length).trim();
    }

    if (cleanedReading.length < 50) {
      console.log('⚠️ Generated reading too short, using generic');
      return generateGenericPalmReading();
    }

    console.log('✅ Text generation successful');
    return cleanedReading;

  } catch (error) {
    console.error('❌ Text generation failed:', error);
    return generateGenericPalmReading();
  }
}

function generateGenericPalmReading(): string {
  const readings = [
    "Tu palma revela una personalidad fuerte y determinada. La línea de la vida muestra vitalidad y energía que te acompañará en todos tus proyectos...",
    "En tu mano veo el signo de una persona creativa y apasionada. Tu línea del destino es clara y profunda...",
    "Las líneas de tu palma hablan de sabiduría interior y gran potencial. Tu futuro está lleno de posibilidades brillantes...",
    "Tu palma irradia energía positiva y determinación. La línea de la vida es larga y estable, prometiendo longevidad y felicidad...",
  ];

  const selectedReading = readings[Math.floor(Math.random() * readings.length)];
  console.log('🎲 Using generic reading');
  return selectedReading;
}
