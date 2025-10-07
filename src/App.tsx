import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box minH="100vh" bg="bg.canvas">
      <Outlet />
    </Box>
  );
}

export default App;
