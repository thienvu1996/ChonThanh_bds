// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initSettings } from "./utils/settingsStore";
import { Toaster } from 'react-hot-toast';

// Khởi tạo cấu hình từ server trước khi render (hoặc song song)
initSettings();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-center" 
      reverseOrder={false} 
      containerStyle={{ zIndex: 999999 }}
      toastOptions={{
        style: {
          fontWeight: 'bold',
          borderRadius: '12px',
        }
      }}
    />
  </React.StrictMode>
);
