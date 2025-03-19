import { renderConversation } from "./components/renderConversation.js"
// Load initial file
// try {
//   const result = await fetch('personal-info.txt');
//   const text = await result.text();
//   await loadData(text);
//   console.log("Data successfully loaded")
// } catch (err) {
//   console.log(err);
// }

let currentAssistantMessage = "";
let conversationHistory = [];

document.getElementById('capture-button').addEventListener('click', async (e) => {
  e.preventDefault();
  const text = document.getElementById('user-input').value;
  if (!text) {
    alert('Please enter some text');
    return;
  }
  try {
    const response = await fetch('/loadData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: text })
    });
    if (response.ok) {
      console.log("Data successfully loaded");
    } else {
      throw new Error('Error loading data');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error loading data');
  }
});

document.getElementById('input-button').addEventListener('click', async (e) => {
  e.preventDefault();
  const history = await renderConversation(conversationHistory);
  conversationHistory = history;
});

let mediaRecorder;
let audioChunks = [];
document.getElementById('record-audio-button').addEventListener('click', async (e) => {
  e.preventDefault();
  const recordButton = document.getElementById('record-audio-button');
  const icon = recordButton.querySelector('i');

  if (icon.classList.contains('fa-microphone')) {
    // Start recording
    icon.classList.remove('fa-microphone');
    icon.classList.add('fa-microphone-slash');
    audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    mediaRecorder.start();
  } else {
    // Stop recording
    icon.classList.remove('fa-microphone-slash');
    icon.classList.add('fa-microphone');
    mediaRecorder.stop();
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });
      audioPlayer.src = URL.createObjectURL(audioBlob);
      audioPlayer.play();
      try {
        const formData = new FormData();
        formData.append('audio', audioFile);
        const response = await fetch('/generateText', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        document.getElementById('user-input').value = data.text;
      } catch (error) {
        console.error('Error:', error);
        alert('Error generating text');
      }
    };
  }
});

document.getElementById('generate-speech-button').addEventListener('click', async (e) => {
  e.preventDefault();
  const text = conversationHistory.at(-1);
  if (!text) {
    alert('Please enter some text');
    return;
  }
  try {
    const response = await fetch('/generateSpeech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: text })
    });
    const speechFile = await response.blob();
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = URL.createObjectURL(speechFile);
    audioPlayer.play();
  } catch (error) {
    console.error('Error:', error);
    alert('Error generating speech');
  }
});
