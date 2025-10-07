export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavigationItem[];
  requiredRole?: 'admin' | 'user';
}

export interface BreakpointContext {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: 'base' | 'sm' | 'md' | 'lg' | 'xl';
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};