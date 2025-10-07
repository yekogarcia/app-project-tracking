import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { AuthProvider } from "./modules/auth/context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" bg="bg.canvas">
        <Outlet />
      </Box>
    </AuthProvider>
  );
}

export default App;
