import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyC0FughrHQw1xrGS0cFmfef_R_M3vVROHk';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: NextRequest) {
    try {
        const { tema, estilo, longitud, publishKdp }: {
            tema: string,
            estilo: string,
            longitud: number,
            publishKdp: boolean
        } = await request.json();

   
        // Validación de parámetros
        if (!tema || !estilo || !longitud) {
            return NextResponse.json({ msg: 'Faltan parámetros necesarios.' }, { status: 400 });
        }

        // Generación de versos
        let poema: string[] = [];
        for (let i = 0; i < longitud; i++) {
            const verso = await GenerarVersoConIA(tema, estilo);
            poema.push(verso);
        }

        // Revisión y edición de versos (simplificado)
        poema = poema.map(verso => revisarYEditar(verso));

        // Formato y diseño del poema
        const documento = CrearDocumento(poema);

        // Publicación del poema en KDP (opcional)
        if (publishKdp) {
            publicarEnKdp(documento);
        }

        // Publicación del poema en otras plataformas
        publicar(documento, 'Instagram');

        return NextResponse.json({ msg: 'Poesía creada exitosamente', poema }, { status: 200 });
    } catch (error) {
        console.error('Error procesando la solicitud:', error);
        return NextResponse.json({ msg: 'Hubo un error procesando la solicitud' }, { status: 400 });
    }
}

async function GenerarVersoConIA(tema: string, estilo: string): Promise<string> {
    try {
        const response = await model.generateContent(`Escribe un verso sobre ${tema} en estilo ${estilo}`);
        console.log(response.response.text());
        
        return response.response.text();
    } catch (error) {
        throw new Error('No se pudo generar el verso con IA.');
    }
}


function revisarYEditar(verso: string): string {
    return verso.trim(); // Ejemplo básico de edición
}

function CrearDocumento(poema: string[]) {
    return { poema }; // Ejemplo básico
}

function publicarEnKdp(documento: any) {
    console.log('Publicando en KDP:', documento);
}

function publicar(documento: any, plataforma: string) {
    console.log(`Publicando en ${plataforma}:`, documento);
}
