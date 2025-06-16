// import { chatHistory, userData } from "./user_data.js";
// const API_KEY = "AIzaSyAbtRVQySzE1adASkDktpBxDd5zzWI5k5M"; // jarvis api.................

// // google ai studio............ api
// const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// const input = document.getElementById("inputBox");
// const selectorBox = document.getElementById("search_selector");
// const output = document.getElementById("output");
// const submit = document.getElementById("submit");
// const startVoice = document.getElementById("startVoice");
// const jarvis_speaking_img = document.getElementById("jarvis_speaking");
// let time_div = document.getElementById("time");
// let online_div = document.getElementById("online");
// let battery_div = document.getElementById("battery");
// let date_div = document.getElementById("date");
// let recognition;

// setInterval(() => {
//   time_div.innerHTML = new Date().toLocaleString().split(",")[1];
//   date_div.innerHTML = new Date().toLocaleString().split(",")[0];
//   online_div.innerHTML = window.navigator.onLine;

//   navigator.getBattery().then((res) => {
//     console.log(res.level * 100);
//     battery_div.innerHTML = `${res.level * 100}%`;
//   });
// }, 1000);

// function getWeather() {
//   const apiKey = "CnqVZ8jtTAOpzh3uaCH6fGdc5k34G8QZ";
//   navigator.geolocation.getCurrentPosition(success, error);

//   function success(position) {
//     const lat = position.coords.latitude;
//     const lon = position.coords.longitude;

//     fetch(
//       `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${lon}`
//     )
//       .then((res) => res.json())
//       .then((locationData) => {
//         const locationKey = locationData.Key;
//         const cityName = locationData.LocalizedName;
//         getFullWeather(locationKey, cityName);
//       })
//       .catch(() => {
//         console.log("Could not get your location from AccuWeather.");
//       });
//   }

//   function error() {
//     console.log("Location access denied or failed.");
//   }

//   function getFullWeather(locationKey, cityName) {
//     fetch(
//       `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         const weatherText = data[0].WeatherText;
//         const temperature = data[0].Temperature.Metric.Value;
//         document.getElementById(
//           "weather"
//         ).innerHTML = `<h3>Weather in ${cityName}:</h3>
//                       <h4 style="margin-top:-10px;"> ${weatherText}, ${temperature}°C</h4>`;
//       })
//       .catch(() => {
//         console.log("Could not load weather data.");
//       });
//   }
// }
// window.addEventListener(
//   "click",
//   () => {
//     speakText("Welcome Mr Tayyeb, How can I help you?");
//     setTimeout(() => {
//       startVoiceHandler();
//     }, 2000);
//   },
//   { once: true }
// );

// // converting array or string..........................
// function arrayToParagraph(arr) {
//   if (Array.isArray(arr)) {
//     arr = arr.join(" ");
//   }
//   return arr
//     .replace(/<\/?[^>]+(>|$)/g, "")
//     .replace(/\n/g, " ")
//     .trim();
// }

// function speakText(text) {
//   let newText = arrayToParagraph(text);
//   responsiveVoice.speak(newText, "Hindi Male", {
//     pitch: 1,
//     rate: 1,
//     onstart: () => {
//       jarvis_speaking_img.style.display = "block";
//       recognition?.stop();
//     },
//     onend: () => {
//       jarvis_speaking_img.style.display = "none";
//     },
//   });
// }

// startVoice.onclick = () => {
//   startVoiceHandler();
// };

// function startVoiceHandler() {
//   recognition = new (window.SpeechRecognition ||
//     window.webkitSpeechRecognition)();
//   recognition.lang = "en-US";
//   recognition.interimResults = false;

//   recognition.onresult = function (event) {
//     let newtext = event.results[0][0].transcript;
//     newtext = newtext.toLowerCase();
//     JarvisCommands(newtext);
//   };

//   recognition.onend = function () {
//     console.log("Recognition ended. Restarting...");
//     recognition.start();
//   };

//   recognition.onerror = function (event) {
//     console.log("Error in main recognition:", event.error);
//     // recognition.start(); // 🔁 Even on error, restart
//   };

//   recognition.start();
// }

// function JarvisCommands(newtext) {
//   if (
//     newtext.startsWith("search for") ||
//     newtext.startsWith("jarvis search for")
//   ) {
//     speakText("Searching for");
//     if (newtext.startsWith("jarvis search for")) {
//       newtext = newtext.replace("jarvis search for", "");
//     } else {
//       newtext = newtext.replace("search for", "");
//     }
//     window.open(`https://google.com/search?q=${newtext}`);
//   } else if (
//     newtext.startsWith("search") ||
//     newtext.startsWith("jarvis search")
//   ) {
//     speakText("Searching for");
//     if (newtext.startsWith("jarvis search")) {
//       newtext = newtext.replace("jarvis search", "");
//     } else {
//       newtext = newtext.replace("search", "");
//     }
//     window.open(`https://www.youtube.com/results?search_query=${newtext}`);
//   } else {
//     StartJarvis(newtext);
//   }
// }

// async function StartJarvis(value) {
//   let md = window.markdownit();

//   const data = {
//     contents: [
//       {
//         parts: [
//           {
//             text: `
//             About You:
//               Name: ${userData[0]["assistant Name"]}
//               More: ${userData[0]["about assistant"]}

//             About Me:
//               Name:${userData[0]["user"]}
//               Age:${userData[0]["user age"]}
//               Skills:${userData[0]["user skills"]}
//               Friends:${userData[0]["user friends"]}
//               Education:${userData[0]["user education"]}
//               Address:${userData[0]["user address"]}

//             Chat History:\n${chatHistory
//               .map((chat) => `User: ${chat.user}\nJarvis: ${chat.jarvis}`)
//               .join("\n")}

//             Ab ye sare bate memory mein rako our porani Chat History ko analyze karke bate karo.

//             Prompt: ${value}`,
//           },
//         ],
//       },
//     ],
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();

//     if (result.candidates && result.candidates.length > 0) {
//       let outputText = md.render(result.candidates[0].content.parts[0].text);
//       output.innerHTML = outputText;
//       let para = arrayToParagraph(outputText);
//       chatHistory.push({ user: value, jarvis: para });

//       speakText(outputText);
//     } else {
//       output.innerHTML = "⚠️ No response received. Try again!";
//       speakText("No response received. Try again!");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     output.innerHTML =
//       "⚠️ An error occurred. Please check your API key or internet connection.";
//   }
// }

// // input box handling logic........................
// input.addEventListener("keypress", (e) => {
//   if (e.key == "Enter") {
//     if (!input.value.trim()) {
//       output.innerHTML = "⚠️ Please enter a prompt!";
//       return;
//     }
//     if (selectorBox.value == "AI") {
//       StartJarvis(input.value);
//     } else {
//       speakText("Searching for");
//       window.open(`https://google.com/search?q=${input.value}`);
//     }
//     input.value = "";
//   }
// });

// submit.onclick = async (e) => {
//   if (!input.value.trim()) {
//     output.innerHTML = "⚠️ Please enter a prompt!";
//     return;
//   }
//   if (selectorBox.value == "AI") {
//     StartJarvis(input.value);
//   } else {
//     speakText("Searching for");
//     window.open(`https://google.com/search?q=${input.value}`);
//   }
//   input.value = "";
// };

// // dropdown logic............................................
// const dropdownBtn = document.getElementById("dropdownBtn");
// const dropdownMenu = document.getElementById("dropdownMenu");
// const dropdownItems = document.querySelectorAll(".dropdown-item");

// dropdownBtn.addEventListener("click", function (e) {
//   e.stopPropagation();

//   dropdownMenu.classList.toggle("show");
//   dropdownBtn.classList.toggle("active");
// });

// dropdownItems.forEach((item) => {
//   item.addEventListener("click", function (e) {
//     e.stopPropagation();
//     dropdownItems.forEach((i) => i.classList.remove("selected"));
//     this.classList.add("selected");
//     const selectedClass = this.classList[1];

//     const buttonIconWrapper = dropdownBtn.querySelector(
//       ".dropdown-button-icon"
//     );
//     buttonIconWrapper.className = `dropdown-button-icon ${selectedClass}`;

//     dropdownMenu.classList.remove("show");
//     dropdownBtn.classList.remove("active");

//     this.style.transform = "scale(0.95)";
//     setTimeout(() => {
//       this.style.transform = "";
//     }, 150);
//   });
// });

// // Close dropdown when clicking outside
// document.addEventListener("click", function () {
//   dropdownMenu.classList.remove("show");
//   dropdownBtn.classList.remove("active");
// });

// // Prevent dropdown from closing when clicking inside
// dropdownMenu.addEventListener("click", function (e) {
//   e.stopPropagation();
// });

// // Handle keyboard navigation
// document.addEventListener("keydown", function (e) {
//   if (e.key === "Escape") {
//     dropdownMenu.classList.remove("show");
//     dropdownBtn.classList.remove("active");
//   }
// });

// getWeather();

import { chatHistory, userData } from "./user_data.js";

const API_KEY = "AIzaSyAbtRVQySzE1adASkDktpBxDd5zzWI5k5M";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const input = document.getElementById("inputBox");
const selectorBox = document.getElementById("search_selector");
const output = document.getElementById("output");
const submit = document.getElementById("submit");
const startVoice = document.getElementById("startVoice");
const jarvis_speaking_img = document.getElementById("jarvis_speaking");
const time_div = document.getElementById("time");
const online_div = document.getElementById("online");
const battery_div = document.getElementById("battery");
const date_div = document.getElementById("date");

let recognition;

setInterval(() => {
  const now = new Date();
  time_div.innerHTML = now.toLocaleTimeString();
  date_div.innerHTML = now.toLocaleDateString();
  online_div.innerHTML = window.navigator.onLine ? "🟢 Online" : "🔴 Offline";

  navigator.getBattery().then((battery) => {
    battery_div.innerHTML = `${Math.round(battery.level * 100)}%`;
  });
}, 1000);

function getWeather() {
  const apiKey = "CnqVZ8jtTAOpzh3uaCH6fGdc5k34G8QZ";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetch(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${latitude},${longitude}`
      )
        .then((res) => res.json())
        .then((locationData) => {
          const locationKey = locationData.Key;
          const cityName = locationData.LocalizedName;

          fetch(
            `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`
          )
            .then((res) => res.json())
            .then((data) => {
              const weatherText = data[0].WeatherText;
              const temp = data[0].Temperature.Metric.Value;
              document.getElementById("weather").innerHTML = `
                <h3>Weather in ${cityName}:</h3>
                <h4 style="margin-top:-10px;">${weatherText}, ${temp}°C</h4>`;
            });
        });
    },
    () => console.log("Geolocation permission denied.")
  );
}

function arrayToParagraph(text) {
  if (Array.isArray(text)) text = text.join(" ");
  return text
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n/g, " ")
    .trim();
}

function speakText(text) {
  const newText = arrayToParagraph(text);

  // Stop recognition before speaking
  if (recognition) {
    try {
      recognition.onend = null; // prevent auto-restart
      recognition.stop();
    } catch (err) {
      console.warn("Recognition stop failed:", err);
    }
  }

  responsiveVoice.speak(newText, "Hindi Male", {
    pitch: 1,
    rate: 1,
    onstart: () => {
      jarvis_speaking_img.style.display = "block";
    },
    onend: () => {
      jarvis_speaking_img.style.display = "none";
      // Resume recognition after speaking ends
      startVoiceHandler();
    },
  });
}

function startVoiceHandler() {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    JarvisCommands(text);
  };

  recognition.onend = () => recognition.start();
  recognition.onerror = () => recognition.start();

  recognition.start();
}

function JarvisCommands(text) {
  if (text.startsWith("search for") || text.startsWith("jarvis search for")) {
    speakText("Searching for");
    const query = text.replace(/^(jarvis )?search for/, "").trim();
    window.open(`https://google.com/search?q=${query}`);
  } else if (text.startsWith("search") || text.startsWith("jarvis search")) {
    speakText("Searching on YouTube");
    const query = text.replace(/^(jarvis )?search/, "").trim();
    window.open(`https://www.youtube.com/results?search_query=${query}`);
  } else {
    StartJarvis(text);
  }
}

async function StartJarvis(promptText) {
  const md = window.markdownit();
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
              Name: ${userData[0]["user"]}
              Age: ${userData[0]["user age"]}
              Skills: ${userData[0]["user skills"]}
              Friends: ${userData[0]["user friends"]}
              Education: ${userData[0]["user education"]}
              Address: ${userData[0]["user address"]}

            Chat History:\n${chatHistory
              .map((chat) => `User: ${chat.user}\nJarvis: ${chat.jarvis}`)
              .join("\n")}

            Prompt: ${promptText}
            `,
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

    if (result.candidates?.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      const htmlOutput = md.render(text);
      output.innerHTML = htmlOutput;
      chatHistory.push({ user: promptText, jarvis: arrayToParagraph(text) });
      speakText(text);
    } else {
      output.innerHTML = "⚠️ No response received.";
      speakText("No response received. Try again!");
    }
  } catch (err) {
    console.error("API Error:", err);
    output.innerHTML =
      "⚠️ API request failed. Please check your key or internet.";
  }
}

// Input event handling
[input, submit].forEach((el) =>
  el.addEventListener("click", handleInputSubmit)
);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleInputSubmit();
});

function handleInputSubmit() {
  const val = input.value.trim();
  if (!val) {
    output.innerHTML = "⚠️ Please enter a prompt!";
    return;
  }

  if (selectorBox.value === "AI") {
    StartJarvis(val);
  } else {
    speakText("Searching for");
    window.open(`https://google.com/search?q=${val}`);
  }

  input.value = "";
}

// Dropdown Logic
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle("show");
  dropdownBtn.classList.toggle("active");
});

dropdownItems.forEach((item) =>
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownItems.forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");

    const selectedClass = item.classList[1];
    dropdownBtn.querySelector(
      ".dropdown-button-icon"
    ).className = `dropdown-button-icon ${selectedClass}`;

    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");
  })
);

document.addEventListener("click", () => {
  dropdownMenu.classList.remove("show");
  dropdownBtn.classList.remove("active");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    dropdownMenu.classList.remove("show");
    dropdownBtn.classList.remove("active");
  }
});

dropdownMenu.addEventListener("click", (e) => e.stopPropagation());

// 🟢 Trigger Jarvis welcome after user interaction
document.addEventListener(
  "click",
  () => {
    if (!window.__jarvisStarted) {
      speakText("Welcome Mr Tayyeb, how can I help you?");
      startVoiceHandler();
      window.__jarvisStarted = true;
    }
  },
  { once: true }
);

getWeather();
startVoice.onclick = startVoiceHandler;
