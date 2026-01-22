import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { ProjectsPage } from "../../modules/projects/pages/ProjectsPage";
import { AdminDashboard } from "@/modules/admin/pages/AdminDashboard";
import { ProfilePage } from "@/modules/admin/pages/ProfilePage";
import { IngresosPage } from "@/modules/admin/pages/IngresosPage";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { ProtectedRoute } from "@/app/components/auth/ProtectedRoute";
import { ResponsiveLayout } from "@/app/components/layout/ResponsiveLayout";
import { ExpensesPage } from "@/modules/expenses/pages/ExpensesPage";


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
        path: "/admin/incomes",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <IngresosPage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/expenses",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <ExpensesPage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/projects",
        element: (
          <ProtectedRoute requiredRole="ADMIN">
            <ResponsiveLayout>
              <ProjectsPage />
            </ResponsiveLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);