import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { authService } from "./services/auth/AuthService";
import { useAuthStore } from "./modules/auth/store/auth.store";

function App() {
  const { logout, login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    authService.validateSession().then((resp) => {
      if (resp.isAuthenticated) {
        console.log("Sesión válida, usuario autenticado");
        login(resp.user);
      } else {
        console.log("Sesión inválida o expirada");
        logout();
      }
    });
  }, []);

  const handleUnauthorized = useCallback(() => {
    console.log("Cerrando session");
    logout();
    navigate("/login");
  }, [logout, navigate]);

  useEffect(() => {
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [handleUnauthorized]);

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Outlet />
    </Box>
  );
}

export default App;
