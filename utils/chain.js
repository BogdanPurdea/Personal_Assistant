import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "./retriever.js"


const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0
});

const standaloneQueryTemplate = `Given a conversation history and a query, create a standalone query.
conversation history: {history}
query: {query}`

const standaloneQueryPrompt = ChatPromptTemplate.fromTemplate(standaloneQueryTemplate);

const answerTemplate = `You are an adaptive AI assistant, designed to provide accurate and context-aware responses. You have access to a conversation history and relevant context.  
Use a calm, precise, adaptive and inquisitive tone. Speak with a balance of warmth and efficiency.
Process the user query based strictly on the given context. Do not generate information beyond what is provided. Refer to the conversation history if necessary to maintain coherence.  

conversation history: {history}  
context: {context}  
query: {query}  
`

const answerPrompt = ChatPromptTemplate.fromTemplate(answerTemplate);

const standaloneQueryChain = standaloneQueryPrompt.pipe(model).pipe(new StringOutputParser());

const retrieverChain = RunnableSequence.from([
  input => input.standaloneQuery,
  retriever,
  docs => docs.map(doc => doc.pageContent).join('\n')
]);

const answerChain = answerPrompt.pipe(model).pipe(new StringOutputParser());

const chain = RunnableSequence.from([
  {
    standaloneQuery: standaloneQueryChain,
    input: new RunnablePassthrough()
  },
  // input => {
  //   console.log(input);
  //   return input;
  // },
  {
    context: retrieverChain,
    history: ({ input }) => input.history,
    query: ({ input }) => input.query
  },
  // input => {
  //   console.log("History: ", input.history);
  //   console.log("Context: ", input.context);
  //   console.log("Question: ", input.query);
  //   return input;
  // },
  answerChain
]);

export { chain }