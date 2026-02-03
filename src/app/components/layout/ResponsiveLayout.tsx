import { Box, Flex } from "@chakra-ui/react";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { MobileNavigation } from "../navigation/MobileNavigation";
import { DesktopSidebar } from "../navigation/DesktopSidebar";
import { TopBar } from "../navigation/TopBar";
import { type NavigationItem } from "../../types";
import { 
  FiHome, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiUser 
} from "react-icons/fi";
import { IoMdList } from "react-icons/io";
import { GrProjects } from "react-icons/gr";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  variant?: 'public' | 'admin';
}

const adminMenuItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <FiHome />,
    path: '/admin',
  },
  {
    id: 'Conceptos',
    label: 'Conceptos',
    icon: <IoMdList />,
    path: '/admin/concepts',
  },
  {
    id: 'proyectos',
    label: 'Proyectos',
    icon: <GrProjects />,
    path: '/admin/projects',
  },
  {
    id: 'egresos',
    label: 'Egresos',
    icon: <FiTrendingDown />,
    path: '/admin/expenses',
  },
  {
    id: 'ingresos',
    label: 'Ingresos',
    icon: <FiTrendingUp />,
    path: '/admin/incomes',
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: <FiUser />,
    path: '/admin/profile',
  },
];

export function ResponsiveLayout({ 
  children, 
  showNavigation = true, 
  variant = 'admin'
}: ResponsiveLayoutProps) {
  const { isMobile } = useBreakpoint();
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (variant === 'public') {
    return (
      <Box minH="100vh" bg="bg.canvas">
        {children}
      </Box>
    );
  }

  return (
    <Flex minH="100vh" bg="bg.canvas">
      {/* Desktop Sidebar */}
      {!isMobile && showNavigation && (
        <DesktopSidebar menuItems={adminMenuItems} />
      )}

      {/* Mobile Navigation */}
      {isMobile && showNavigation && (
        <MobileNavigation
          isOpen={isOpen}
          onClose={onClose}
          menuItems={adminMenuItems}
        />
      )}

      {/* Main Content Area */}
      <Flex direction="column" flex="1" overflow="hidden">
        {/* Top Bar */}
        {showNavigation && (
          <TopBar 
            onMenuClick={isMobile ? onOpen : undefined}
            showMenuButton={isMobile}
          />
        )}

        {/* Page Content */}
        <Box flex="1" overflow="auto" p={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Flex>

      {/* Debug Components */}
      {/* <ThemeDebug />
      <BreakpointDebug /> */}
    </Flex>
  );
}