import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { sleep } from "@/app/helpers";
import { CharactersAndScenarios, ColoringBook } from "@/types/coloringBook";

import { publishkdp } from "@/app/services/amazonkdp";

const API_KEY = "AIzaSyC0FughrHQw1xrGS0cFmfef_R_M3vVROHk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const url = "https://cloud.leonardo.ai/api/rest/v1/generations";

export async function POST(request: NextRequest) {
  const body: ColoringBook = await request.json();
  const { theme, numberOfImages, key, language, publishAmazon } = body;
  let kdp

  // Consultar Personajes y escenarios
  const prompt: CharactersAndScenarios[] = await charactersandscenarios(theme, numberOfImages);

  // Validar si lo van a publicar en amazon KDP para subir info
  if (publishAmazon) { kdp = await publishkdp(theme, language) }

  // Generar imagenes para colorear
  try {
    const generationIds = await Promise.all(prompt.map(({ character, scenario, theme }) => fetchLeonardoIa(theme, character, scenario, body)));

    let validGenerationIds = generationIds.filter((id) => id !== null) as string[];

    if (validGenerationIds.length === 0) {
      // IDs de reserva en caso de error
      validGenerationIds = [
        "a74990d6-2e58-4d2b-b076-0e80abf8a45f",
        "2e0acf72-d25a-428e-94e2-dbad37b38b28",
        "280be471-eee6-47b5-84db-581a383c7a8a",
        "f8ea4c3c-e4ab-4794-ad5f-5d7c2f9dd330",
        "18f7062e-4c13-4fdf-adf6-3100f21d6f0a",
      ];
    }

    const imageUrls = await fetchImageUrls(validGenerationIds, key);
    console.log(imageUrls);


    return NextResponse.json({ imageUrls, kdp });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Hubo un error al procesar la solicitud" }, { status: 400 });
  }

}

async function fetchLeonardoIa(theme: string, character: string, scenario: string, body: ColoringBook): Promise<string | null> {

  const { format, key, category, difficulty, numberOfImages } = body

  const data = {
    alchemy: false,
    height: 1024,
    modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628', // Leonardo Kino XL
    num_images: 1,
    presetStyle: 'CINEMATIC',
    prompt: `Chibi-style drawing of ${character} from ${theme}, in a scene ${scenario}. The drawing should be in a ${format} format with a   black outline, suitable for a coloring book for ${category} of an ${difficulty} difficulty level and a white background.`,
    width: 1024,
    elements: [{ akUUID: 'd0ebdbf7-a570-4b93-8406-306bbb2a3469', weight: 1 }] // Coloring Book
  };

  // const data = {
  //   alchemy: false,
  //   height: 512,
  //   modelId: 'aa77f04e-3eec-4034-9c07-d0f619684628', // Leonardo Kino XL
  //   num_images: 1,
  //   presetStyle: 'CINEMATIC',
  //   prompt: `Chibi-style drawing of ${character} from ${theme}, in a scene ${scenario}. The drawing should be in a ${format} format with a black outline, suitable for a coloring book for ${category} of an ${difficulty} difficulty level and a white background.`,
  //   width: 512,
  // };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(data)
  };

  return null

  try {

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error("LLAVE INCORRECTA, PUEDE CREAR UNA LLAVE EN: https://app.leonardo.ai/api-access");
      return null;
    }

    const jsonResponse = await response.json();
    const idImage = jsonResponse.sdGenerationJob.generationId;

    // Esperar N segundos para permitir la generación de N imágenes, cada imagen con 7000 ms
    await sleep(5000 * numberOfImages);

    return idImage;
  } catch (error) {
    console.error('Error al hacer la solicitud:', error);
    return null;
  }
}

async function fetchImageUrls(generationIds: string[], key: string): Promise<string[]> {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
  };

  const fetchPromises = generationIds.map(async (id) => {
    try {
      const response = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${id}`, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dataRes = await response.json();

      if (!dataRes || !dataRes.generations_by_pk || !dataRes.generations_by_pk.generated_images || dataRes.generations_by_pk.generated_images.length === 0) {
        throw new Error('No se encontraron imágenes generadas');
      }

      const imageUrl = dataRes.generations_by_pk.generated_images[0].url;
      return imageUrl;
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return null;
    }
  });

  const imageUrls = await Promise.all(fetchPromises);
  return imageUrls.filter((url) => url !== null) as string[];
}

async function charactersandscenarios(theme: string, numberOfImages: number): Promise<CharactersAndScenarios[]> {
  try {
    if (!theme || !numberOfImages) {
      throw new Error("Faltan parámetros 'theme' o 'numberOfImages'");
    }

    const prompt = `Make me a list of ${theme} characters or objects of ${numberOfImages} in different scenarios and make it in this format: [{"theme": "${theme}","character": "", "scenario": ""},{"theme": "${theme}","character": "", "scenario": ""}], please do not add more text in your answer, only the arrangement`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return JSON.parse(response.text().replace(/```html|```/g, ""));
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
}
