import { chatHistory, userData } from "./user_data.js";
const API_KEY = "AIzaSyAbtRVQySzE1adASkDktpBxDd5zzWI5k5M"; // jarvis api.................

// google ai studio............ api
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const input = document.getElementById("inputBox");
const selectorBox = document.getElementById("search_selector");
const output = document.getElementById("output");
const submit = document.getElementById("submit");
const startVoice = document.getElementById("startVoice");
const jarvis_speaking_img = document.getElementById("jarvis_speaking");
let time_div = document.getElementById("time");
let online_div = document.getElementById("online");
let battery_div = document.getElementById("battery");
let date_div = document.getElementById("date");

setInterval(() => {
  time_div.innerHTML = new Date().toLocaleString().split(",")[1];
  date_div.innerHTML = new Date().toLocaleString().split(",")[0];
  online_div.innerHTML = window.navigator.onLine;

  navigator.getBattery().then((res) => {
    console.log(res.level * 100);
    battery_div.innerHTML = `${res.level * 100}%`;
  });
}, 1000);

window.addEventListener("DOMContentLoaded", () => {
  speakText("Welcome Mr Tayyeb, How can i help you?");
  setTimeout(() => {
    startVoiceHandler();
  }, 2000);
});

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
  responsiveVoice.speak(newText, "Hindi Male", {
    pitch: 1,
    rate: 1,
    onstart: () => (jarvis_speaking_img.style.display = "block"),
    onend: () => (jarvis_speaking_img.style.display = "none"),
  });
}

startVoice.onclick = () => {
  startVoiceHandler();
};

function startVoiceHandler() {
  let recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  // recognition.continuous = true; // keeps running
  recognition.interimResults = false;

  recognition.onstart = function () {
    startVoice.src = "./images/start_voice.png";
  };

  recognition.onresult = function (event) {
    let text = event.results[0][0].transcript;
    text = text.toLowerCase();
    if (text.startsWith("search for") || text.startsWith("jarvis search for")) {
      speakText("Searching for");
      if (text.startsWith("jarvis search for")) {
        text = text.replace("jarvis search for", "");
      } else {
        text = text.replace("search for", "");
      }
      window.open(`https://google.com/search?q=${text}`);
    } else if (text.startsWith("search") || text.startsWith("jarvis search")) {
      speakText("Searching for");
      if (text.startsWith("jarvis search")) {
        text = text.replace("jarvis search", "");
      } else {
        text = text.replace("search", "");
      }
      window.open(`https://www.youtube.com/results?search_query=${text}`);
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
}

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

// input box handling logic........................
input.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (!input.value.trim()) {
      output.innerHTML = "⚠️ Please enter a prompt!";
      return;
    }
    if (selectorBox.value == "AI") {
      StartJarvis(input.value);
    } else {
      speakText("Searching for");
      window.open(`https://google.com/search?q=${input.value}`);
    }
    input.value = "";
  }
});

submit.onclick = async (e) => {
  if (!input.value.trim()) {
    output.innerHTML = "⚠️ Please enter a prompt!";
    return;
  }
  if (selectorBox.value == "AI") {
    StartJarvis(input.value);
  } else {
    speakText("Searching for");
    window.open(`https://google.com/search?q=${input.value}`);
  }
  input.value = "";
};

// dropdown logic............................................
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation();

  dropdownMenu.classList.toggle("show");
  dropdownBtn.classList.toggle("active");
});

dropdownItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdownItems.forEach((i) => i.classList.remove("selected"));
    this.classList.add("selected");
    const selectedClass = this.classList[1];

    const buttonIconWrapper = dropdownBtn.querySelector(
      ".dropdown-button-icon"
    );
    buttonIconWrapper.className = `dropdown-button-icon ${selectedClass}`;

    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");

    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
    }, 150);
  });
});

// Close dropdown when clicking outside
document.addEventListener("click", function () {
  dropdownMenu.classList.remove("show");
  dropdownBtn.classList.remove("active");
});

// Prevent dropdown from closing when clicking inside
dropdownMenu.addEventListener("click", function (e) {
  e.stopPropagation();
});

// Handle keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");
  }
});
