import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: apiKey,
  model: "text-embedding-3-small",
});

const supabaseClient = createClient(
  supabaseUrl,
  supabaseKey
);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "personal_docs",
  queryName: "match_personal_docs",
});

export { vectorStore }