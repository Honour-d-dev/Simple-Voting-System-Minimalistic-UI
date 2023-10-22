import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {window.ethereum ? (
      <App />
    ) : (
      <div className="m-auto flex-col items-center justify-center rounded px-4 py-20 text-center shadow-md">
        <h1 className="border-b border-zinc-500 text-3xl font-medium">
          <span className="text-4xl">OOPs!!!</span> MetaMask not detected
        </h1>
        please install Metamask .
      </div>
    )}
  </React.StrictMode>,
);
