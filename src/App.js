import "./App.css";
import { useRef, useEffect, useState } from "react";
import { BeatmapDecoder } from "osu-parsers";
import { StandardRuleset } from "osu-standard-stable";
import { ScoreInfo } from "osu-classes";

function App() {
  const [selectedMods, setSelectedMods] = useState(["NM"]);

  const toggleMod = (mod) => {
    setSelectedMods((prevMods) => {
      if (mod === "NM") {
        return ["NM"];
      }
      // Handling for mods that don't work together.
      if (mod === "HR" && prevMods.includes("EZ")) {
        const newMods = [...prevMods, "HR"];
        return newMods.filter((m) => m !== "EZ");
      }
      if (mod === "EZ" && prevMods.includes("HR")) {
        const newMods = [...prevMods, "EZ"];
        return newMods.filter((m) => m !== "HR");
      }
      if (mod === "DT" && prevMods.includes("HT")) {
        const newMods = [...prevMods, "DT"];
        return newMods.filter((m) => m !== "HT");
      }
      if (mod === "HT" && prevMods.includes("DT")) {
        const newMods = [...prevMods, "HT"];
        return newMods.filter((m) => m !== "DT");
      }

      // Mod handling for mods that do work together
      if (prevMods.includes(mod)) {
        const newMods = prevMods.filter((m) => m !== mod);
        return newMods.length === 0 ? ["NM"] : newMods;
      } else {
        const newMods = [...prevMods, mod];
        return newMods.includes("NM")
          ? newMods.filter((m) => m !== "NM")
          : newMods;
      }
    });
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

const mods = ["NM", "HR", "DT", "HD", "FL", "NF", "EZ", "HT", "SO"];
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
  const cachedBeatMapID = useRef(null);
  const parsedBeatMap = useRef(null);

  useEffect(() => {
    const getPPResults = async () => {
      //Getting beatmap and decoding
      const beatmapID = window.location.hash.split("/").pop();
      if (beatmapID !== cachedBeatMapID.current) {
        console.log("downloading beatmap...");
        const response = await fetch(`https://osu.ppy.sh/osu/${beatmapID}`);
        console.log("Downloaded");
        const text = await response.text();
        const decoder = new BeatmapDecoder();
        // const parsedBeatMap = decoder.decodeFromString(text);
        cachedBeatMapID.current = beatmapID;
        parsedBeatMap.current = decoder.decodeFromString(text);
      }

      const ruleset = new StandardRuleset();
      let mods = "";
      if (!selectedMods.includes("NM") && selectedMods.length !== 1) {
        mods = selectedMods.join("");
      }

      const modsRuleset = ruleset.createModCombination(mods);
      let standardBeatMap;
      if (mods == "") {
        standardBeatMap = ruleset.applyToBeatmap(parsedBeatMap.current);
      } else {
        standardBeatMap = ruleset.applyToBeatmapWithMods(
          parsedBeatMap.current,
          modsRuleset
        );
      }

      console.log("Calculating performance points...");
      const difficultyCalculator =
        ruleset.createDifficultyCalculator(standardBeatMap);

      const difficultyAttributes = difficultyCalculator.calculate();
      let ppResults = [];

      accuracies.map((acc) => {
        const accDecimal = parseFloat((acc / 100).toFixed(2));
        const totalHits = standardBeatMap.hitObjects.length;
        const countMiss = 0;
        const count50 = 0;
        const count300 = Math.round(totalHits * accDecimal);

        const score = new ScoreInfo({
          maxCombo: standardBeatMap.maxCombo,
          rulesetId: 0,
          mods: modsRuleset,
          count300: count300,
          count100: totalHits - count300,
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
        const performanceAttributes =
          performanceCalculator.calculateAttributes();
        ppResults.push(performanceAttributes.totalPerformance);
      });

      setPPVals(ppResults);
    };
    getPPResults();
  }, [selectedMods]);

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
                {Math.round(ppVals[i])}
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
