import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const mountNode = document.getElementById("osu-pp-calculator");

if (mountNode) {
  const root = ReactDOM.createRoot(mountNode);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
