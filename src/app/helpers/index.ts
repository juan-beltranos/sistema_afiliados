
import fetch from 'node-fetch'; // Importa fetch adecuado para Node.js

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer(); // Utiliza arrayBuffer en lugar de buffer

    // Convierte el arrayBuffer a base64
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    return base64String;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

