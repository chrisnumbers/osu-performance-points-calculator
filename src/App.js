import "./App.css";
import { useState } from "react";

function App() {
  const [pp, setPp] = useState(100);
  const [selectedMods, setSelectedMods] = useState([]);

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
          <AccuracyMenu accuracies={accuracies} />
        </div>
      </div>
    </div>
  );
}

function Title() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-bold text-base text-white">
        PP
      </div>
      <h3 className="text-4xl font-bold text-pink-400">
        Performance Points Calculator
      </h3>
    </div>
  );
}

// const mods = ["NM", "HR", "DT", "HD", "FL", "EZ", "NF", "SO", "HT"];
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
function AccuracyMenu({ pp }) {
  return (
    <div className="flex flex-col gap-2 ml-6">
      {accuracies.map((acc) => {
        // Simulated PP drop per percent (you can replace this logic later)
        const adjustedPp = Math.round(pp * (acc / 100));

        return (
          <div key={acc} className="text-sm font-medium text-gray-700">
            {acc}%: <span className="font-semibold text-pink-500">{pp} pp</span>
          </div>
        );
      })}
    </div>
  );
}

export default App;
