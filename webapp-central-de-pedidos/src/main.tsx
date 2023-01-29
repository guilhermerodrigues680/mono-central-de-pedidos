import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { VERSION_INFO, VERSION_INFO_TXT } from "./config/version-info";

console.info("Version info:", VERSION_INFO_TXT, VERSION_INFO);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
