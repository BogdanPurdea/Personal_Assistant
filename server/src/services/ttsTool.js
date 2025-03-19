import path from "path";
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSpeech(input) {

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: input
    });

    return await mp3.arrayBuffer();
}