import { getCurrentTimestamp } from "./currentTimestamp.js"
import userAvatarSrc from "../assets/user_profile.png";
import assistantAvatarSrc from "../assets/ai_profile.png";

export async function renderConversation(history) {
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
    userAvatar.src = userAvatarSrc;
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
    assistantAvatar.src = assistantAvatarSrc;
    assistantAvatar.alt = "Assistant Avatar";
    assistantAvatar.classList.add("avatar");

    // Create assistant message container
    const assistantMessage = document.createElement("div");
    assistantMessage.classList.add("message", "assistant-message");

    // Create the assistant message text
    const assistantMessageText = document.createElement("p");
    let responseText;
    // Chain invocation to get LLM response and update conversation history
    try {
        const response = await fetch('/processQuery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ history, query })
        });
        const data = await response.json();
        responseText = data.response;
        history.push(query);
        history.push(responseText);
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing query');
    }
    // Update the assistant message text and timestamp
    assistantMessageText.textContent = responseText;
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

    return history;
}