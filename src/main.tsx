import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { UIProvider } from "./app/components/ui/provider";
import { router } from "./app/routes";
import { registerSW } from 'virtual:pwa-register';

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  </StrictMode>
);

registerSW({
  onOfflineReady() {
    console.log('PWA lista para offline')
  },
  onNeedRefresh() {
    console.log('Nueva versión disponible')
  },
})
