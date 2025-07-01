async function loadReact() {
    try {
        console.log("Loading manifest...")
        const manifest = await fetch(chrome.runtime.getURL("asset-manifest.json"))
        const manifestJSON = await manifest.json()
        const mainJSPath = manifestJSON.files["main.js"]
        const mainCSSPath = manifestJSON.files["main.css"]

        if (mainCSSPath) {
            console.log("Loading CSS")
            const link = document.createElement("link");
            link.href = chrome.runtime.getURL(mainCSSPath);
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }

        if (mainJSPath) {
            console.log("Loading JS script")
            const script = document.createElement('script')
            script.src = chrome.runtime.getURL(mainJSPath) //location for react after build
            script.type = 'text/javascript';
            script.onload = () => {
                console.log("osu pp extension react bundle loaded")
            };
            document.body.appendChild(script);
        }

    } catch (error) {
        console.error("Failed to load react: ", error);
    }
}





function renderPPCounter(beatmap_info) {
    console.log("Running renderPPCounter...")
    if (!beatmap_info) {
        console.log("There was no beatmap info.")
        return;
    }

    newDiv = document.createElement('div');
    newDiv.id = 'osu-pp-calculator';

    console.log("Inserting div element...")
    beatmap_info.insertAdjacentElement("afterend", newDiv);

    // const script = document.createElement('script')
    // script.src = chrome.runtime.getURL('static/js/main.js') //location for react after build
    // script.type = 'text/javascript';
    // script.onload = () => {
    //     console.log("osu pp extensikon react bundle loaded")
    // };
    // document.body.appendChild(script);
    loadReact()
}

// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => renderPPCounter(document.querySelector('.beatmapset-info')));
// } else {
// renderPPCounter(document.querySelector('.beatmapset-info'));
// }

function waitForElementLoad() {
    const startTime = Date.now()

    const checkIfExists = setInterval(() => {
        const beatmap_info = document.querySelector('.beatmapset-info')
        if (beatmap_info) {
            clearInterval(checkIfExists)
            renderPPCounter(beatmap_info)
        } else if (Date.now() - startTime > 5000) {
            clearInterval(checkIfExists)
            console.log("Timed out after 5000ms, couldn't find beatmapset-info")
        } 
    }, 100)
} 

console.log("[osu-pp-extension] content script loaded");
waitForElementLoad()