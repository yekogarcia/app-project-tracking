import {
  Box,
  VStack,
  Button,
  Text,
  Icon,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import type { NavigationItem } from "../../types";

interface DesktopSidebarProps {
  menuItems: NavigationItem[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DesktopSidebar({ 
  menuItems, 
  isCollapsed = false 
}: DesktopSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      w={isCollapsed ? "16" : "64"}
      bg="bg.surface"
      borderRightWidth="1px"
      // borderColor="gray.700"
      boxShadow="xs"
      _light={{
        borderColor: "gray.200",
        // boxShadow: "inset -1px 0 0 rgba(0,0,0,0.04)",
      }}
      _dark={{
        borderColor: "gray.700",
      }}
      transition="width 0.2s"
      flexShrink={0}
    >
      {/* Logo/Brand */}
      <Box p="6" borderBottomWidth="1px" borderColor="border.subtle">
        <Text 
          fontSize="xl" 
          fontWeight="bold" 
          color="fg.emphasized"
          display={isCollapsed ? "none" : "block"}
        >
          Project Tracking
        </Text>
        {isCollapsed && (
          <Text fontSize="xl" fontWeight="bold" color="fg.emphasized">
            PT
          </Text>
        )}
      </Box>

      {/* Navigation Menu */}
      <VStack gap="1" p="4" align="stretch">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "solid" : "ghost"}
              colorScheme={isActive ? "blue" : "gray"}
              justifyContent="flex-start"
              onClick={() => handleNavigation(item.path)}
              size="md"
              fontWeight="medium"
            >
              <Icon>{item.icon}</Icon>
              {!isCollapsed && item.label}
            </Button>
          );
        })}
      </VStack>
    </Box>
  );
}