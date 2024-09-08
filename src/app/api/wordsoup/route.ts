import { NextResponse, NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { publishkdp } from '@/app/services/amazonkdp';

const API_KEY = 'AIzaSyC0FughrHQw1xrGS0cFmfef_R_M3vVROHk';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface WordSearchRequestBody {
    width: number;
    height: number;
    theme: string;
    amountWords: number;
    amountWordSoup: number;
    language: string;
    publishAmazon: boolean;
}

type Grid = string[][];

function createEmptyGrid(width: number, height: number): Grid {
    return Array.from({ length: height }, () => Array(width).fill(''));
}

function chooseRandomDirection(): 'horizontal' | 'vertical' | 'diagonal' {
    const directions = ['horizontal', 'vertical', 'diagonal'] as const;
    return directions[Math.floor(Math.random() * directions.length)];
}

function chooseRandomPosition(width: number, height: number): [number, number] {
    const startRow = Math.floor(Math.random() * height);
    const startCol = Math.floor(Math.random() * width);
    return [startRow, startCol];
}

function canFitOnGrid(
    grid: Grid,
    word: string,
    startRow: number,
    startCol: number,
    direction: 'horizontal' | 'vertical' | 'diagonal'
): boolean {
    const length = word.length;
    if (direction === 'horizontal' && startCol + length <= grid[0].length) {
        for (let i = 0; i < length; i++) {
            if (grid[startRow][startCol + i] !== '') return false;
        }
        return true;
    } else if (direction === 'vertical' && startRow + length <= grid.length) {
        for (let i = 0; i < length; i++) {
            if (grid[startRow + i][startCol] !== '') return false;
        }
        return true;
    } else if (
        direction === 'diagonal' &&
        startRow + length <= grid.length &&
        startCol + length <= grid[0].length
    ) {
        for (let i = 0; i < length; i++) {
            if (grid[startRow + i][startCol + i] !== '') return false;
        }
        return true;
    }
    return false;
}

function placeWordOnGrid(
    grid: Grid,
    word: string,
    startRow: number,
    startCol: number,
    direction: 'horizontal' | 'vertical' | 'diagonal'
): void {
    const length = word.length;
    if (direction === 'horizontal') {
        for (let i = 0; i < length; i++) {
            grid[startRow][startCol + i] = word[i];
        }
    } else if (direction === 'vertical') {
        for (let i = 0; i < length; i++) {
            grid[startRow + i][startCol] = word[i];
        }
    } else if (direction === 'diagonal') {
        for (let i = 0; i < length; i++) {
            grid[startRow + i][startCol + i] = word[i];
        }
    }
}

function getRandomLetter(): string {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function fillEmptySpaces(grid: Grid): void {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = getRandomLetter();
            }
        }
    }
}

async function getRandomWords(theme: string, amountWords: number, language: string): Promise<string[]> {
    const response = await model.generateContent(
        `Generate ${amountWords} unique words related to the theme "${theme}". Each word should be different from the others and relevant to the theme. Format the response as a comma-separated list without any periods at the end of the words. The response should be in ${language}.`
    );

    const lines = response.response.text().trim().split('\n');
    const words: string[] = lines
        .map(line => line.trim())
        .flatMap(line => line.split(','))
        .map(word => word.trim().toUpperCase().replace(/\.$/, ''));

    return words;
}

async function ensureUniqueWords(
    wordList: string[],
    theme: string,
    language: string,
    usedWords: Set<string>
): Promise<string[]> {
    const uniqueWords = new Set(wordList);

    while (uniqueWords.size < wordList.length) {
        const newWords = await getRandomWords(theme, wordList.length - uniqueWords.size, language);
        newWords.forEach(word => {
            if (!usedWords.has(word)) {
                uniqueWords.add(word);
                usedWords.add(word);
            }
        });
    }

    return Array.from(uniqueWords);
}

export async function POST(request: NextRequest) {
    try {
        const body: WordSearchRequestBody = await request.json();
        const { width, height, theme, amountWords, language, amountWordSoup, publishAmazon } = body;
        let kdp

        console.log(body);


        // Validar si lo van a publicar en amazon KDP para subir info
        if (publishAmazon) { kdp = await publishkdp(theme, language) }

        const wordSoups = [];
        const usedWords = new Set<string>();

        for (let i = 0; i < amountWordSoup; i++) {
            let wordList = await getRandomWords(theme, amountWords, language);

            console.log(wordList);


            // Check for duplicates in the generated word list and request new words if needed
            wordList = await ensureUniqueWords(wordList, theme, language, usedWords);

            const grid = createEmptyGrid(width, height);

            for (const word of wordList) {
                let placed = false;

                while (!placed) {
                    const direction = chooseRandomDirection();
                    const [startRow, startCol] = chooseRandomPosition(width, height);
                    if (canFitOnGrid(grid, word, startRow, startCol, direction)) {
                        placeWordOnGrid(grid, word, startRow, startCol, direction);
                        placed = true;
                    }
                }
            }
            fillEmptySpaces(grid);
            wordSoups.push({ grid, wordList });
        }

        return NextResponse.json({ wordSoups, kdp }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ msg: 'Hubo un error procesando la solicitud' }, { status: 400 });
    }
}