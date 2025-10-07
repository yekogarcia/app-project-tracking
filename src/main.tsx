import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { UIProvider } from "./app/components/ui/provider";
import { router } from "./app/routes";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
  });
}
