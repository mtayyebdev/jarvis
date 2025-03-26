import { chatHistory, userData } from "./user_data.js";
const API_KEY = "AIzaSyChoFmCfdZJk5Ry6QiOgMCy9vJt4vZI_Gs"; // jarvis api.................

// google ai studio............ api
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const input = document.getElementById("inputBox");
const output = document.getElementById("output");
const submit = document.getElementById("submit");
const startVoice = document.getElementById("startVoice");
const jarvis_speaking_img = document.getElementsByClassName("jarvis_speaking");

// converting array or string..........................
function arrayToParagraph(arr) {
  if (Array.isArray(arr)) {
    arr = arr.join(" ");
  }
  return arr
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n/g, " ")
    .trim();
}

function speakText(text) {
  let newText = arrayToParagraph(text);
  responsiveVoice.speak(newText, "Hindi Male", { rate: 1, pitch: 1 });
}

startVoice.onclick = () => {
  let recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onstart = function () {
    startVoice.src = "./images/start_voice.png";
  };

  recognition.onresult = function (event) {
    let text = event.results[0][0].transcript;
    text=text.toLowerCase()
    if (text.includes("open facebook")) {
      speakText("opening facebook");
      window.open("https://facebook.com");
    } else if (text.includes("open youtube")) {
      speakText("opening youtube");
      window.open("https://youtube.com");
    } else if (text.includes("open whatsapp")) {
      speakText("opening whatsapp");
      window.open("https://web.whatsapp.com/#");
    } else {
      StartJarvis(text);
    }
  };

  recognition.onend = function () {
    startVoice.src = "./images/307c73143a955f1e0bf26a41b98a035c_w200.webp";
  };

  recognition.onerror = function (event) {
    console.log("Error:", event.error);
  };

  recognition.start();
};

async function StartJarvis(value) {
  let md = window.markdownit();

  const data = {
    contents: [
      {
        parts: [
          {
            text: `
            About You:
              Name: ${userData[0]["assistant Name"]}
              More: ${userData[0]["about assistant"]}

            About Me:
              Name:${userData[0]["user"]}
              Age:${userData[0]["user age"]}
              Skills:${userData[0]["user skills"]}
              Friends:${userData[0]["user friends"]}
              Education:${userData[0]["user education"]}
              Address:${userData[0]["user address"]}
            
            Chat History:\n${chatHistory
              .map((chat) => `User: ${chat.user}\nJarvis: ${chat.jarvis}`)
              .join("\n")}

            Ab ye sare bate memory mein rako our porani Chat History ko analyze karke bate karo.

            Prompt: ${value}`,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0) {
      let outputText = md.render(result.candidates[0].content.parts[0].text);
      output.innerHTML = outputText;
      let para = arrayToParagraph(outputText);
      chatHistory.push({ user: value, jarvis: para });
      speakText(outputText);
    } else {
      output.innerHTML = "⚠️ No response received. Try again!";
      speakText("No response received. Try again!");
    }
  } catch (error) {
    console.error("Error:", error);
    output.innerHTML =
      "⚠️ An error occurred. Please check your API key or internet connection.";
  }
}

submit.onclick = async (e) => {
  if (!input.value.trim()) {
    output.innerHTML = "⚠️ Please enter a prompt!";
    return;
  }
  StartJarvis(input.value);
  input.value = "";
};
