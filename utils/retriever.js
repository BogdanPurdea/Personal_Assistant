import { vectorStore } from "./vectorStore.js"

const retriever = vectorStore.asRetriever(1);

export { retriever }