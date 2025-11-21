import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 👤 Tipos para autenticación
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  phone?: number;
  address?: string;
  type?: 'PERSONAL' | 'COMPANY';
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: number;
  address?: string;
  type: 'PERSONAL' | 'COMPANY';
}

// 🌐 Estado global de la aplicación
export interface AppState {
  // 👤 Autenticación
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  
  // 🎨 UI State
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  
  // 📱 Responsive
  isMobile: boolean;
  
  // 🔔 Notificaciones
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    timestamp: Date;
    read: boolean;
  }>;
  
  // 🔄 Estado de carga global
  globalLoading: boolean;
}

export interface AppActions {
  // 👤 Acciones de autenticación
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  setUser: (user: User | null) => void;
  
  // 🎨 Acciones de UI
  setTheme: (theme: AppState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  
  // 🔔 Acciones de notificaciones
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // 🔄 Acciones de carga global
  setGlobalLoading: (loading: boolean) => void;
}

export type AppStore = AppState & AppActions;

// 🏪 Store principal de la aplicación
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        user: null,
        isAuthenticated: false,
        isLoading: false,
        authError: null,
        theme: 'system',
        sidebarOpen: false,
        isMobile: false,
        notifications: [],
        globalLoading: false,

        // 👤 Acciones de autenticación
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, authError: null });
          
          try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user data - en producción vendría del backend
            const user: User = {
              id: Date.now().toString(),
              email: credentials.email,
              name: 'Usuario Test',
              role: 'ADMIN', // 🎯 Rol admin por defecto para testing
              createdAt: new Date(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false, 
              authError: null 
            });
          } catch (error) {
            set({ 
              authError: error instanceof Error ? error.message : 'Error de autenticación',
              isLoading: false 
            });
          }
        },

        register: async (data: RegisterData) => {
          set({ isLoading: true, authError: null });
          
          try {
            // Validar que las contraseñas coincidan
            if (data.password !== data.confirmPassword) {
              throw new Error('Las contraseñas no coinciden');
            }
            
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user: User = {
              id: Date.now().toString(),
              email: data.email,
              name: data.name,
              role: 'ADMIN', // 🎯 Rol admin por defecto para testing
              phone: data.phone,
              address: data.address,
              type: data.type,
              createdAt: new Date(),
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false, 
              authError: null 
            });
          } catch (error) {
            set({ 
              authError: error instanceof Error ? error.message : 'Error de registro',
              isLoading: false 
            });
          }
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            authError: null 
          });
        },

        clearAuthError: () => {
          set({ authError: null });
        },

        setUser: (user: User | null) => {
          set({ user, isAuthenticated: !!user });
        },

        // 🎨 Acciones de UI
        setTheme: (theme: AppState['theme']) => {
          set({ theme });
        },

        toggleSidebar: () => {
          set((state: AppState) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        setIsMobile: (isMobile: boolean) => {
          set({ isMobile });
        },

        // 🔔 Acciones de notificaciones
        addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => {
          const newNotification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false,
          };
          
          set((state: AppState) => ({
            notifications: [newNotification, ...state.notifications],
          }));
        },

        markNotificationAsRead: (id: string) => {
          set((state: AppState) => ({
            notifications: state.notifications.map(notification =>
              notification.id === id ? { ...notification, read: true } : notification
            ),
          }));
        },

        removeNotification: (id: string) => {
          set((state: AppState) => ({
            notifications: state.notifications.filter(notification => notification.id !== id),
          }));
        },

        clearAllNotifications: () => {
          set({ notifications: [] });
        },

        // 🔄 Acciones de carga global
        setGlobalLoading: (loading: boolean) => {
          set({ globalLoading: loading });
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          user: state.user,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
);

// 🎯 Hooks personalizados para usar el store
export const useAuth = () => {
  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);
  const error = useAppStore((state) => state.authError);
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const logout = useAppStore((state) => state.logout);
  const clearAuthError = useAppStore((state) => state.clearAuthError);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError: clearAuthError,
    isAdmin: user?.role === 'ADMIN',
  };
};

export const useTheme = () => {
  const theme = useAppStore((state: AppStore) => state.theme);
  const setTheme = useAppStore((state: AppStore) => state.setTheme);
  
  return { theme, setTheme };
};

export const useNotifications = () => {
  const notifications = useAppStore((state: AppStore) => state.notifications);
  const addNotification = useAppStore((state: AppStore) => state.addNotification);
  const markNotificationAsRead = useAppStore((state: AppStore) => state.markNotificationAsRead);
  const removeNotification = useAppStore((state: AppStore) => state.removeNotification);
  const clearAllNotifications = useAppStore((state: AppStore) => state.clearAllNotifications);
  
  const unreadCount = notifications.filter((n: AppState['notifications'][0]) => !n.read).length;
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markNotificationAsRead,
    removeNotification,
    clearAllNotifications,
  };
};

export const useSidebar = () => {
  const sidebarOpen = useAppStore((state: AppStore) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state: AppStore) => state.toggleSidebar);
  const setSidebarOpen = useAppStore((state: AppStore) => state.setSidebarOpen);
  const isMobile = useAppStore((state: AppStore) => state.isMobile);
  const setIsMobile = useAppStore((state: AppStore) => state.setIsMobile);
  
  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    isMobile,
    setIsMobile,
  };
};