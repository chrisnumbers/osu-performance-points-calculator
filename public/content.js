async function loadReact() {
  try {
    const manifest = await fetch(chrome.runtime.getURL("asset-manifest.json"));
    const manifestJSON = await manifest.json();
    const mainJSPath = manifestJSON.files["main.js"];
    const mainCSSPath = manifestJSON.files["main.css"];

    if (mainCSSPath) {
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL(mainCSSPath);
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (mainJSPath) {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL(mainJSPath); //location for react after build
      script.type = "text/javascript";
      document.body.appendChild(script);
    }
  } catch (error) {
    console.error("Failed to load React: ", error);
  }
}

let currentURL = window.location.href;
let currentHash = window.location.hash;

setInterval(() => {
  const newURL = window.location.href;
  const newHash = window.location.hash;

  if (newURL !== currentURL || newHash !== currentHash) {
    currentURL = newURL;
    currentHash = newHash;

    waitForElementLoad(); // Handle page changes
  }
}, 1000);

function renderPPCounter(beatmap_info) {
  // Always remove existing component
  const existing = document.getElementById("osu-pp-calculator");
  if (existing) {
    existing.remove();
  }

  if (!beatmap_info) {
    return;
  }

  container = document.createElement("div");
  container.id = "osu-pp-calculator";
  container.className = "page-extra";
  container.style.marginTop = "10px";

  beatmap_info.insertAdjacentElement("afterend", container);

  loadReact();
}

function waitForElementLoad(retries = 50) {
  const beatmap_info = document.querySelector(".beatmapset-info");

  if (beatmap_info) {
    renderPPCounter(beatmap_info);
  } else if (retries > 0) {
    setTimeout(() => waitForElementLoad(retries - 1), 100);
  } else {
    console.warn("⚠️ Timed out waiting for .beatmapset-info");
  }
}
