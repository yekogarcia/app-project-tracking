// 🏪 Stores de la aplicación - Centralizando el manejo de estado con Zustand

// Store principal de la aplicación
export {
  useAppStore,
  useAuth,
  useTheme,
  useNotifications,
  useSidebar,
} from './appStore';

// Store para formularios numéricos
export {
  useNumericFormStore,
} from './numericFormStore';

// 🎯 Tipos para TypeScript
export type { AppState, AppActions, AppStore } from './appStore';
export type { NumericFormState, NumericFormData, BaseFormState } from './numericFormStore';