import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAuthContextProvider } from "./context/auth/context-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleAuthContextProvider>
          <App />
        </GoogleAuthContextProvider>
      </GoogleOAuthProvider>
    </Router>
  </StrictMode>
);
