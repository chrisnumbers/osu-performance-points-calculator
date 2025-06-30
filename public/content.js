async function loadReact() {
    try {
        console.log("Loading manifest...")
        const manifest = await fetch(chrome.runtime.getURL("asset-manifest.json"))
        const manifestJSON = await manifest.json()
        const mainJSPath = manifestJSON.files["main.js"]

        if (mainJSPath) {
            console.log("Manifest exists, loading script...")
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

console.log("[osu-pp-extension] content script loaded");
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderPPCounter(document.querySelector('.beatmapset-info')));
} else {
renderPPCounter(document.querySelector('.beatmapset-info'));
}