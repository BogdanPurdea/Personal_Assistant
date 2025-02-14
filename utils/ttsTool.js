import path from "path";
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

export async function generateSpeech(input) {

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input
    });

    return await mp3.arrayBuffer();
}