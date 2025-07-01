import './App.css';
import { useState } from 'react';

function App() {
const [pp, setPp] = useState(100)
  return (
    <>
      <Title />
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


export default App;

