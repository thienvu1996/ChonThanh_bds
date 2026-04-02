// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initSettings } from "./utils/settingsStore";

// Khởi tạo cấu hình từ server trước khi render (hoặc song song)
initSettings();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
