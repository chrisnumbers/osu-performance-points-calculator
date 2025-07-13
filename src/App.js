import "./App.css";
import { useRef, useEffect, useState } from "react";
import { BeatmapDecoder } from "osu-parsers";
import { StandardRuleset } from "osu-standard-stable";
import { ScoreInfo } from "osu-classes";
// import { initWasm. Beatmap, GameMode, Performance } from "rosu-pp-js/web";
// console.log("init is", typeof init);

function App() {
  const [selectedMods, setSelectedMods] = useState(["nomod"]);

  // useEffect(() => {
  //   const initialize = async () => {
  //     console.log("initializing wasm....");
  //     await initWasm(fetch(chrome.runtime.getURL("static/rosu_pp_js_bg.wasm")));
  //     console.log("WASM initialized");
  //   };
  //   initialize();
  // }, []);

  const toggleMod = (mod) => {
    setSelectedMods((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  return (
    <div className="text-lg p-6 w-full">
      <Title />
      <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-6">
        <div className="w-full md:w-1/2">
          <ModMenu selectedMods={selectedMods} toggleMod={toggleMod} />
        </div>
        <div className="w-full md:w-1/2">
          <AccuracyMenu selectedMods={selectedMods} />
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-bold text-base text-white">
        osu!
      </div>
      <h3 className="text-4xl font-bold text-pink-400">
        Performance Points Calculator
      </h3>
    </div>
  );
}

const mods = ["NM", "HR", "DT", "HD", "FL", "EZ", "NF", "SO", "HT"];
// const mods = [
//   "nomod",
//   "hardrock",
//   "doubletime",
//   "hidden",
//   "flashlight",
//   "easy",
//   "nofail",
//   "spunout",
//   "halftime",
// ];
function ModMenu({ selectedMods, toggleMod }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {mods.map((mod) => (
        <ModButton
          key={mod}
          mod={mod}
          selected={selectedMods.includes(mod)}
          onToggle={toggleMod}
        />
      ))}
    </div>
  );
}

function ModButton({ mod, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(mod)}
      className={`p-0 border rounded-md overflow-hidden w-22 h-22 ${
        selected ? "border-pink-500 border-2" : "border-gray-300"
      }`}
    >
      <img
        src={`chrome-extension://iildhehkepajopoaljbbhfoncnajgdge/images/${mod}.png`}
        alt={mod}
        className="object-contain w-full h-full"
      />
    </button>
  );
}
const accuracies = [100, 99, 98, 97];
function AccuracyMenu({ selectedMods }) {
  const [ppVals, setPPVals] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const initialized = useRef(false);

  // useEffect(() => {
  //   const getPPResults = async () => {
  //     //initialize for rosu if it isn't already
  //     try {
  //       const beatmapID = window.location.hash.split("/").pop();
  //       console.log("downloading beatmap...");
  //       const response = await fetch(`https://osu.ppy.sh/osu/${beatmapID}`);
  //       console.log("Downloaded");
  //       const text = await response.text();
  //       console.log("Got text");
  //       const map = new rosu.Beatmap(text);
  //       console.log("Map created");
  //       map.convert(rosu.GameMode.Osu);

  //       if (map.isSuspicious()) {
  //         console.log("Sus map");
  //         return;
  //       }
  //       let mods = "";
  //       if (!selectedMods.includes("NM") && selectedMods.length !== 1) {
  //         mods = selectedMods.join("");
  //       }
  //       // if (selectedMods.includes("NM") && selectedMods.length === 1) {
  //       //   mods = "";
  //       // } else {
  //       //   mods = selectedMods.join("");
  //       // }
  //       console.log("Calculating Max PP");
  //       const maxAttrs = new rosu.Performance({ mods: mods }).calculate(map);
  //       let ppResults = [];
  //       ppResults.push(maxAttrs.pp);

  //       for (let i = 1; i < accuracies.length; i++) {
  //         console.log("Loop 1");
  //         const newAttrs = new rosu.Performance({
  //           mods: mods,
  //           accuracy: accuracies[i],
  //         }).calculate(maxAttrs);
  //         ppResults.push(newAttrs.pp);
  //       }
  //       setPPVals(ppResults);
  //       map.free();
  //     } catch (err) {
  //       console.log(err);
  //     }

  //     // setLoading(false);
  //   };

  //   getPPResults();
  // }, []);

  useEffect(() => {
    const getPPResults = async () => {
      //Getting beatmap and decoding
      const beatmapID = window.location.hash.split("/").pop();
      console.log("downloading beatmap...");
      const response = await fetch(`https://osu.ppy.sh/osu/${beatmapID}`);
      console.log("Downloaded");
      const text = await response.text();
      const decoder = new BeatmapDecoder();
      const parsedBeatMap = decoder.decodeFromString(text);

      const ruleset = new StandardRuleset();
      let mods = "";
      if (!selectedMods.includes("NM") && selectedMods.length !== 1) {
        mods = selectedMods.join("");
      }
      const modsRuleset = ruleset.createModCombination(mods);
      let standardBeatMap;
      if (mods == "") {
        standardBeatMap = ruleset.applyToBeatmap(parsedBeatMap);
      } else {
        standardBeatMap = ruleset.applyToBeatmapWithMods(
          parsedBeatMap,
          modsRuleset
        );
      }

      console.log("Calculating performance points...");
      const difficultyCalculator =
        ruleset.createDifficultyCalculator(standardBeatMap);

      const difficultyAttributes = difficultyCalculator.calculate();

      const score = new ScoreInfo({
        accuracy: 0.99,
        maxCombo: standardBeatMap.maxCombo,
        rulesetId: 0,
        mods: modsRuleset,
        count300: Math.round(standardBeatMap.hitObjects.length * 0.99),
        count100: Math.round(standardBeatMap.hitObjects.length * 0.01),
        count50: 0,
        countMiss: 0,
      });
      const accuracyCalculation =
        (score.count300 + score.count100 / 3 + score.count50 / 6) /
        (score.count300 + score.count100 + score.count50 + score.countMiss);
      score.accuracy = accuracyCalculation;
      console.log(`Accuracy: ${accuracyCalculation}`);

      const performanceCalculator = ruleset.createPerformanceCalculator(
        difficultyAttributes,
        score
      );
      const performanceAttributes = performanceCalculator.calculateAttributes();
      setPPVals([performanceAttributes.totalPerformance]);
    };
    getPPResults();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 ml-6">
      {accuracies.map((acc, i) => {
        return (
          // <div key={acc} className="text-sm font-medium text-gray-700">
          //   {acc}%: <span className="font-semibold text-pink-500">{adjustedPp} pp</span>
          // </div>
          <div
            key={acc}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-300 shadow-sm bg-[##222527] text-white"
          >
            <div className="text-lg text-white font-medium">{acc}%</div>
            {ppVals.length !== 0 ? (
              <div className="text-4xl font-bold text-pink-400 leading-tight">
                {ppVals[0]}
                <span className="text-lg font-semibold ml-1">pp</span>
              </div>
            ) : (
              <span className="text-lg font-semibold ml-1">Loading...</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
