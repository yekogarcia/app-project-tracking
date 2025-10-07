import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { ProyectosPage } from "../../modules/admin/pages/ProyectosPage";
import { AdminDashboard } from "@/modules/admin/pages/AdminDashboard";
import { ProfilePage } from "@/modules/admin/pages/ProfilePage";
import { IngresosPage } from "@/modules/admin/pages/IngresosPage";
import { EgresosPage } from "@/modules/admin/pages/EgresosPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <AdminDashboard />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/profile",
        element: <ProfilePage />,
      },
      {
        path: "/admin/ingresos",
        element: <IngresosPage />,
      },
      {
        path: "/admin/egresos",
        element: <EgresosPage />,
      },
      {
        path: "/admin/proyectos",
        element: <ProyectosPage />,
      },
    ],
  },
]);