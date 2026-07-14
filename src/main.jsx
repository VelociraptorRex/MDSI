import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/source-serif-4/500.css";
import "@fontsource/source-serif-4/600-italic.css";
import App from "./App";
import { prepareSpanishVoices } from "./utils/speech";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";

prepareSpanishVoices();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App page={document.body.dataset.page || "home"} />
  </React.StrictMode>
);
