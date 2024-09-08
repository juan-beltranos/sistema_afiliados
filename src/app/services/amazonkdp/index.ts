import { GoogleGenerativeAI } from "@google/generative-ai";
import { languagePrompts } from "@/prompts";

const API_KEY = "AIzaSyC0FughrHQw1xrGS0cFmfef_R_M3vVROHk";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function publishkdp(theme: string, language: string) {
    try {
        if (!theme || !language) {
            console.log("Faltan parámetros 'serie' o 'idioma'");
            return;
        }

        const prompts = languagePrompts[language] || languagePrompts['english'];

        const prompt = `give me the response in html and add </br> tags if necessary
            ${prompts.title} ${theme}.
            ${prompts.subtitle}.
            ${prompts.keywords} ${theme}.
            ${prompts.description}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().replace(/```html|```/g, "");
    } catch (error) {
        console.log(error);
    }
}