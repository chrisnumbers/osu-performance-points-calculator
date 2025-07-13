// import init, { Performance, Beatmap, GameMode } from "rosu-pp-js";
// import * as rosu from "rosu-pp-js";
// const beatmapID = window.location.hash.split("/").pop();
// const response = await fetch(`https://osu.ppy.sh/osu/${beatmapID}`);

// beatmap.convert(GameMode.Osu);
// const diff = new Difficulty({ mods: mods.join("") });
// // const beatmapData = await response.text()

// const beatmap = new Beatmap(beatmapData);
// const performance = new Performance({
//   mods,
// });

async function loadReact() {
  try {
    console.log("Loading manifest...");
    const manifest = await fetch(chrome.runtime.getURL("asset-manifest.json"));
    const manifestJSON = await manifest.json();
    const mainJSPath = manifestJSON.files["main.js"];
    const mainCSSPath = manifestJSON.files["main.css"];

    if (mainCSSPath) {
      console.log("Loading CSS");
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL(mainCSSPath);
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (mainJSPath) {
      console.log("Loading JS script");
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL(mainJSPath); //location for react after build
      script.type = "text/javascript";
      script.onload = () => {
        console.log("osu pp extension react bundle loaded");
      };
      document.body.appendChild(script);
    }
  } catch (error) {
    console.error("Failed to load react: ", error);
  }
}

function renderPPCounter(beatmap_info) {
  console.log("Running renderPPCounter...");
  if (!beatmap_info) {
    console.log("There was no beatmap info.");
    return;
  }

  container = document.createElement("div");
  container.id = "osu-pp-calculator";
  container.className = "page-extra";
  container.style.marginTop = "10px";

  console.log("Inserting div element...");
  beatmap_info.insertAdjacentElement("afterend", container);

  // const script = document.createElement('script')
  // script.src = chrome.runtime.getURL('static/js/main.js') //location for react after build
  // script.type = 'text/javascript';
  // script.onload = () => {
  //     console.log("osu pp extensikon react bundle loaded")
  // };
  // document.body.appendChild(script);
  loadReact();
}

// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => renderPPCounter(document.querySelector('.beatmapset-info')));
// } else {
// renderPPCounter(document.querySelector('.beatmapset-info'));
// }

function waitForElementLoad() {
  const startTime = Date.now();

  const checkIfExists = setInterval(() => {
    const beatmap_info = document.querySelector(".beatmapset-info");
    if (beatmap_info) {
      clearInterval(checkIfExists);
      renderPPCounter(beatmap_info);
    } else if (Date.now() - startTime > 5000) {
      clearInterval(checkIfExists);
      console.log("Timed out after 5000ms, couldn't find beatmapset-info");
    }
  }, 100);
}

const mods = [
  "nomod",
  "hardrock",
  "doubletime",
  "hidden",
  "flashlight",
  "easy",
  "nofail",
  "spunout",
  "halftime",
];

// async function initializeWASM() {
//   console.log("initializing...");
//   await init(chrome.runtime.getURL("rosu_pp_js_bg.wasm"));
//   console.log("initialized!");
//   waitForElementLoad();
// }
// console.log("init is", typeof init);
console.log("[osu-pp-extension] content script loaded");
// initializeWASM();
waitForElementLoad();

chrome.runtime.getURL("rosu_pp_js_bg.wasm");
