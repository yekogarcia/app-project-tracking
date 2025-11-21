import {
  Box,
  Flex,
  IconButton,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FiMenu, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "@/app/store/appStore"; // 🎯 Cambiado a Zustand

interface TopBarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopBar({ onMenuClick, showMenuButton }: TopBarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  return (
    <Box
      bg="bg.surface"
      borderBottomWidth="1px"
      borderColor="border.subtle"
      px={{ base: 4, md: 6 }}
      py="3"
    >
      <Flex justify="space-between" align="center">
        {/* Left side - Menu button for mobile */}
        <HStack>
          {showMenuButton && (
            <IconButton
              aria-label="Open menu"
              onClick={onMenuClick}
              variant="ghost"
            >
              <FiMenu />
            </IconButton>
          )}
          <Text fontSize="lg" fontWeight="semibold" color="fg.emphasized">
            Admin Dashboard
          </Text>
        </HStack>

        {/* Right side - Theme toggle and User menu */}
        <HStack gap="2">
          <ThemeToggle size="sm" />
          <MenuRoot>
            <MenuTrigger asChild>
              <Button variant="ghost" p="2">
                <HStack>
                  <Box
                    w="8"
                    h="8"
                    borderRadius="full"
                    bg="blue.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Box>
                  <Box display={{ base: "none", md: "block" }} textAlign="left">
                    <Text fontSize="sm" fontWeight="medium">
                      {user?.name || 'Usuario'}
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      {user?.email || ''}
                    </Text>
                  </Box>
                </HStack>
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="profile" onClick={handleProfileClick}>
                <FiUser />
                Ver Perfil
              </MenuItem>
              <MenuItem value="settings">
                <FiSettings />
                Configuración
              </MenuItem>
              <MenuItem value="logout" onClick={handleLogout}>
                <FiLogOut />
                Cerrar Sesión
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </HStack>
      </Flex>
    </Box>
  );
}