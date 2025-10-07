import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginCredentials, RegisterData, User } from '../types';

// Auth reducer
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
    case 'REGISTER_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_user', JSON.stringify(user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: error instanceof Error ? error.message : 'Error de autenticación' 
      });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: 'user',
        createdAt: new Date(),
      };
      
      // Store in localStorage for persistence
      localStorage.setItem('auth_user', JSON.stringify(user));
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'REGISTER_ERROR', 
        payload: error instanceof Error ? error.message : 'Error de registro' 
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Initialize auth state from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}