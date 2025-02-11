import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "/utils/vectorStore";

export async function loadData(data) {
    const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 300,
            chunkOverlap: 40
        });
        
    const splits = await splitter.createDocuments([data]);
    
    await vectorStore.addDocuments(splits);
}

