// Core infrastructure exports
export { UIProvider } from './components/ui/provider';
export { useBreakpoint, useIsMobile, useResponsiveValue } from './hooks/useBreakpoint';
export { router, ROUTES } from './routes';
export type * from './types';

// Re-export commonly used types
export type {
  User,
  AuthState,
  NavigationItem,
  ResponsiveLayoutProps,
  BreakpointContext,
} from './types';