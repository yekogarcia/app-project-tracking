import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { authService } from "./services/auth/AuthService";
import { useAuthStore } from "./modules/auth/store/auth.store";

function App() {
  const { logout, login } = useAuthStore();

    useEffect(() => {
      authService.validateSession().then((resp) => {
        if (resp.isAuthenticated) {
          console.log("Sesión válida, usuario autenticado", resp);
          login(resp.user);
        } else {
          console.log("Sesión inválida o expirada");
          logout();
        }
      });
    }, []);

  return (
    <Box minH="100vh" bg="bg.canvas">
      <Outlet />
    </Box>
  );
}

export default App;
