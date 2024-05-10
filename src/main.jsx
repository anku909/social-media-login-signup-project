import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FirebaseProvider } from "./context/firebase.jsx";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
