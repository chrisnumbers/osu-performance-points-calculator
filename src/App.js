import './App.css';
import { useState } from 'react';

function App() {
const [pp, setPp] = useState(100)
  return (
    <>
      <h1>osu! PP Viewer</h1>
      <p>Current PP: {pp}</p>
    </>
  );
}

export default App;
