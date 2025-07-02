import './App.css';
import { useState } from 'react';

function App() {
const [pp, setPp] = useState(100)
const [selectedMods, setSelectedMods] = useState([]);

const toggleMod = (mod) => {
  setSelectedMods((prev) => 
    prev.includes(mod) ? prev.filter((m) => m!== mod) : [...prev, mod]
);
}

  return (
    <>
      <Title />
      <ModMenu />
    </>
  );
}


function Title() {
  return (
    <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center font-bold text-sm text-blue-900">
          PP
        </div>
      <h3 className="text-lg font-bold text-pink-400">Performance Points Calculator</h3>
    </div>
  )
}

const mods = ['NM', 'HR', 'DT', 'HD', 'FL', 'EZ', 'NF', 'SO', 'HT']
function ModMenu({ selectedMods, toggleMod }) {
  return (
    <div className="flex flex-wrap gap-2">
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

function Mod({ mod, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(mod)}
      className={`px-3 py-1 rounded-md border text-sm font-semibold transition-all ${
        selected
          ? 'bg-pink-500 text-white border-pink-500'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
      }`}
    >
      {mod}
    </button>
  );
}

function AccuracyMenu() {
  return (
    <div className="flex flex-col gap-2 ml-6">
      {accuracies.map((acc) => (
        <button
          key={acc}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          // You can add click handlers here for accuracy selection if needed
        >
          {acc}%
        </button>
      ))}
    </div>
  )
}

export default App;

