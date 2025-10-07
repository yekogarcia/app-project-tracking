import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerBackdrop,
  VStack,
  Button,
  Text,
  Icon,
  HStack,
  Separator,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { type NavigationItem } from "../../types";
import { ThemeToggle } from "../ui/ThemeToggle";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: NavigationItem[];
}

export function MobileNavigation({ 
  isOpen, 
  onClose, 
  menuItems 
}: MobileNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <DrawerRoot open={isOpen} onOpenChange={({ open }) => !open && onClose()} placement="start">
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
          <Text fontSize="lg" fontWeight="bold" color="fg.emphasized">
            Project Tracker
          </Text>
          <DrawerCloseTrigger />
        </DrawerHeader>

        <DrawerBody p="4">
          <VStack gap="2" align="stretch">
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
                  {item.label}
                </Button>
              );
            })}
            
            <Separator my="4" />
            
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" color="fg.muted">
                Tema
              </Text>
              <ThemeToggle size="sm" />
            </HStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
}