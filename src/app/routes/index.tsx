import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { ProyectosPage } from "../../modules/admin/pages/ProyectosPage";
import { AdminDashboard } from "@/modules/admin/pages/AdminDashboard";
import { ProfilePage } from "@/modules/admin/pages/ProfilePage";
import { IngresosPage } from "@/modules/admin/pages/IngresosPage";
import { EgresosPage } from "@/modules/admin/pages/EgresosPage";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { ResponsiveLayout } from "@/app/components/layout/ResponsiveLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <ResponsiveLayout>
              <AdminDashboard />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <ResponsiveLayout>
              <AdminDashboard />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/profile",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <ProfilePage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/ingresos",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <IngresosPage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/egresos",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <EgresosPage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/proyectos",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <ProyectosPage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);