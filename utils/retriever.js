import { vectorStore } from "/utils/vectorStore"

const retriever = vectorStore.asRetriever(1);

export { retriever }