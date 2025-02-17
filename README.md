# AI-Powered Personal Assistant

## Overview
This project was created as part of the AI Engineer Path provided by Scrimba.
This AI-powered personal assistant integrates with OpenAI's API to provide intelligent and personalized interactions. It leverages a Supabase vector store for contextual memory and supports both text and voice-based interactions.

## Features
### AI-Powered Chat
- Users can interact with an AI assistant powered by OpenAI's API.
- The assistant has access to a Supabase vector store containing personal data for personalized responses.

### Data Capture
- Users can capture and store data from their chat input directly to the vector store.
- The assistant learns and references new information over time.

### Speech-to-Text
- Users can record their voice, and captured audio is sent to OpenAI's speech-to-text endpoint for transcription.
- The transcribed text is automatically populated into the chat input for hands-free interaction.

### Text-to-Speech
- The assistant's responses can be converted into audio using OpenAI's text-to-speech endpoint.
- Users can listen to the assistant’s output for a more accessible and user-friendly experience.

## Setup Instructions
### Prerequisites
- A valid OpenAI API key
- A Supabase project and API credentials

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ai-personal-assistant.git
   cd ai-personal-assistant
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```sh
   npm start
   ```
## Usage
- Type or speak your query to interact with the assistant.
- The assistant will generate responses based on available data and stored memory.
- Save important information to the vector store for future reference.
- Enable text-to-speech to listen to responses.

## Dependencies
- [OpenAI API](https://openai.com/) - Used for AI-powered chat, speech-to-text, and text-to-speech functionalities.
- [Supabase](https://supabase.io/) - Provides a vector store for storing and retrieving user data.
- [Vite](https://vitejs.dev/) - A fast build tool for developing and bundling the project. This Vite setup was provided by the Scrimba environment.
- [LangChain](https://python.langchain.com/) - Used for managing AI workflows, memory, and retrieval-augmented generation (RAG) for enhanced interactions.
