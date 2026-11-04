import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateContentWithTimeout(params, timeoutMs) {
  const controller = new AbortController();
  let timeoutId;

  try {
    return await Promise.race([
      ai.models.generateContent({
        ...params,
        config: { ...params.config, abortSignal: controller.signal }
      }),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('AI_TIMEOUT'));
        }, timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request) {
  try {
    const { filename, imageData } = await request.json();
    const safeFilename = typeof filename === 'string' ? filename : '';
    let spatialData = null;
    let methodUsed = '';

    // Attempt 1: Vision analysis with a four-second timeout.
    try {
      if (typeof imageData !== 'string' || !imageData.includes(',')) {
        throw new Error('Missing or invalid image data.');
      }

      const base64String = imageData.split(',')[1];
      if (!base64String) {
        throw new Error('Missing image content.');
      }

      const prompt = `
        You are an expert GIS spatial analyst. Look at this uploaded map image (named ${safeFilename}).
        Determine its exact real-world bounding box coordinates in Kenya.
        Return ONLY a raw JSON object with no markdown:
        {"south": float, "north": float, "west": float, "east": float, "method": "string"}
      `;

      const aiResponse = await generateContentWithTimeout({
        model: 'gemini-3.8-flash',
        contents: [
          { inlineData: { data: base64String, mimeType: 'image/jpeg' } },
          prompt
        ]
      }, 4000);
      const rawText = aiResponse.text.trim().replace(/```json/g, '').replace(/```/g, '');
      spatialData = JSON.parse(rawText);
      methodUsed = spatialData.method;
    } catch (visionError) {
      console.warn('Vision AI timed out or failed. Triggering Smart Text Fallback...', visionError);

      let cleanLocation = '';

      // Attempt 2: Ask Gemini to clean the location with a three-second timeout.
      try {
        const textPrompt = `Extract the broad town/county from filename: "${safeFilename}". Format: "Town, County, Kenya". Ignore plots/blocks.`;
        const textResponse = await generateContentWithTimeout({
          model: 'gemini-3.8-flash',
          contents: textPrompt
        }, 3000);
        cleanLocation = textResponse.text.trim();
      } catch (textError) {
        console.warn('Text AI failed. Triggering Dynamic Cadastral Fallback...', textError);

        let baseName = safeFilename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        baseName = baseName.replace(/\(.*?\)/g, '');
        const cadastralNoise = /\b(BLOCK|PLOT|PHASE|SCHEME|SETTLEMENT|SHEET|FR|LR|NO|ESTATE|PARCEL|ZONE|AREA)\b\s*\d*/gi;
        const strippedName = baseName.replace(cadastralNoise, '').replace(/\s+/g, ' ').trim();
        cleanLocation = strippedName ? `${strippedName}, Kenya` : 'Kenya';
      }

      if (!cleanLocation.trim() || cleanLocation === 'Kenya') {
        throw new Error('Could not determine a location from the uploaded filename.');
      }

      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanLocation)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'Sovereign-Spatial-Hub-Demo/1.0' }
      });
      const data = await response.json();

      if (data && data.length > 0) {
        const place = data[0];
        const bbox = place.boundingbox;
        spatialData = {
          south: parseFloat(bbox[0]),
          north: parseFloat(bbox[1]),
          west: parseFloat(bbox[2]),
          east: parseFloat(bbox[3])
        };
        methodUsed = `Fallback Geocoding (${cleanLocation})`;
      } else {
        throw new Error(`Nominatim returned no results for: ${cleanLocation}`);
      }
    }

    return NextResponse.json({
      success: true,
      bounds: spatialData,
      method: methodUsed
    });
  } catch (error) {
    console.error('Georeferencing error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}