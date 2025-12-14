// Core infrastructure exports
export { UIProvider } from './components/ui/provider';
export { router } from './routes';
export type * from './types';

// Re-export commonly used types
export type {
  User,
  AuthState,
  NavigationItem,
  BreakpointContext,
} from './types';