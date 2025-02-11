import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { retriever } from "/utils/retriever"

const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const model = new ChatOpenAI({
  openAIApiKey: apiKey,
  model: "gpt-4o-mini",
  temperature: 0
});

const standaloneQueryTemplate = `Given a conversation history and a query, create a standalone query.
conversation history: {history}
query: {query}`

const standaloneQueryPrompt = ChatPromptTemplate.fromTemplate(standaloneQueryTemplate);

const answerTemplate = `You are a helpfull personal assistant. You are given access to a converstation history and a context. Base your responses solely on the context, do not make up answers. Make use of the conversation history if necessary. Given a user query provide a fitting answer.
conversation history: {history}
context: {context}
query: {query}`

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
//   input => {
//     console.log(input);
//     return input;
//   },
  {
    context: retrieverChain,
    history: ({ input }) => input.history,
    query: ({ input }) => input.query
  },
//   input => {
//     console.log("History: ", input.history);
//     console.log("Context: ", input.context);
//     console.log("Question: ", input.query);
//     return input;
//   },
  answerChain
]);

export { chain }