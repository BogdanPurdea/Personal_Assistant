import { DallEAPIWrapper } from "@langchain/openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const imageGenerationTool = new DallEAPIWrapper({
    apiKey: apiKey
});

export { imageGenerationTool }