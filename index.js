import { loadData } from "/utils/loadData";
import { chain } from "/utils/chain";
import { getCurrentTimestamp } from "/utils/currentTimestamp"
// Load initial file
// try {
//   const result = await fetch('personal-info.txt');
//   const text = await result.text();
//   await loadData(text);
//   console.log("Data successfully loaded")
// } catch (err) {
//   console.log(err);
// }

const conversationHistory = []

document.getElementById('input-button').addEventListener('click', async (e) => {
  e.preventDefault();
  renderConversation();
});

async function renderConversation() {
  const userInput = document.getElementById('user-input');
  const chatContainer = document.querySelector('.chat-container');
  const inputContainer = document.querySelector('.input-container');
  const query = userInput.value;
  userInput.value = '';

  // Create user timestamp element
  const userMessageTimestamp = document.createElement("div");
  userMessageTimestamp.classList.add("timestamp");
  userMessageTimestamp.textContent = getCurrentTimestamp();

  // Create user message container
  const userMessageContainer = document.createElement("div");
  userMessageContainer.classList.add("message-container", "user");

  // Create user avatar image
  const userAvatar = document.createElement("img");
  userAvatar.src = "assets/user.png";
  userAvatar.alt = "User Avatar";
  userAvatar.classList.add("avatar");

  // Create user message container
  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user-message");

  // Create the user message text
  const userMessageText = document.createElement("p");
  userMessageText.textContent = query;

  // Append user message text to the message container
  userMessage.appendChild(userMessageText);

  // Append user avatar and user message container to the user message container
  userMessageContainer.appendChild(userAvatar);
  userMessageContainer.appendChild(userMessage);

  // Append user timestamp and user message container to the chat container
  chatContainer.insertBefore(userMessageTimestamp, inputContainer);
  chatContainer.insertBefore(userMessageContainer, inputContainer);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Create assistant timestamp element
  const assistantMessageTimestamp = document.createElement("div");
  assistantMessageTimestamp.classList.add("timestamp");


  // Create assistant message container
  const assistantMessageContainer = document.createElement("div");
  assistantMessageContainer.classList.add("message-container", "assistant");

  // Create assistant avatar image
  const assistantAvatar = document.createElement("img");
  assistantAvatar.src = "assets/aish.png";
  assistantAvatar.alt = "Assistant Avatar";
  assistantAvatar.classList.add("avatar");

  // Create assistant message container
  const assistantMessage = document.createElement("div");
  assistantMessage.classList.add("message", "assistant-message");

  // Create the assistant message text
  const assistantMessageText = document.createElement("p");

  // Chain invokation to get llm response and update conversation history
  const response = await chain.invoke({ history: conversationHistory, query });
  conversationHistory.push(query);
  conversationHistory.push(response);
  
  // Update the assistant message text and timestamp
  assistantMessageText.textContent = response;
  assistantMessageTimestamp.textContent = getCurrentTimestamp();

  // Append assistant message text to the assistant message container
  assistantMessage.appendChild(assistantMessageText);

  // Append assistant avatar and assistant message container to the assistant message container
  assistantMessageContainer.appendChild(assistantMessage);
  assistantMessageContainer.appendChild(assistantAvatar);

  // Append assistant timestamp and assistant message container to the chat container
  chatContainer.insertBefore(assistantMessageTimestamp, inputContainer);
  chatContainer.insertBefore(assistantMessageContainer, inputContainer);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}