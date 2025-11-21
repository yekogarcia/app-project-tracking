import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// 📊 Tipos base para el estado
export interface BaseFormState {
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
}

// 🔢 Estado específico para formularios con campos numéricos
export interface NumericFormData {
  // Campos de ejemplo - ajustar según tus necesidades
  age?: number;
  salary?: number;
  price?: number;
  quantity?: number;
  percentage?: number;
  
  // Campos de texto opcionales
  name?: string;
  description?: string;
}

export interface NumericFormState extends BaseFormState {
  // 📝 Datos del formulario
  formData: NumericFormData;
  
  // 🎯 Acciones
  setField: (field: keyof NumericFormData, value: string | number | undefined) => void;
  setMultipleFields: (fields: Partial<NumericFormData>) => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setDirty: (dirty: boolean) => void;
  
  // 🔄 Utilidades
  getNumericValue: (field: keyof NumericFormData) => number | undefined;
  getFormattedValue: (field: keyof NumericFormData, format?: 'currency' | 'percentage' | 'decimal') => string;
  isValid: () => boolean;
  getChangedFields: () => Partial<NumericFormData>;
}

// 🏪 Store principal para formularios numéricos
export const useNumericFormStore = create<NumericFormState>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        isLoading: false,
        error: null,
        isDirty: false,
        formData: {},

        // ✅ Establecer un campo específico
        setField: (field, value) => {
          set((state) => {
            const newFormData = { ...state.formData };
            
            // Convertir a número si es necesario
            if (typeof value === 'string' && value.trim() !== '') {
              const numValue = parseFloat(value);
              (newFormData as any)[field] = !isNaN(numValue) ? numValue : value;
            } else {
              (newFormData as any)[field] = value;
            }
            
            return {
              formData: newFormData,
              isDirty: true,
              error: null, // Limpiar error al cambiar datos
            };
          });
        },

        // ✅ Establecer múltiples campos
        setMultipleFields: (fields) => {
          set((state) => ({
            formData: { ...state.formData, ...fields },
            isDirty: true,
            error: null,
          }));
        },

        // 🔄 Reset del formulario
        resetForm: () => {
          set({
            formData: {},
            isDirty: false,
            error: null,
            isLoading: false,
          });
        },

        // 📊 Manejo de loading
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        // ❌ Manejo de errores
        setError: (error) => {
          set({ error, isLoading: false });
        },

        clearError: () => {
          set({ error: null });
        },

        // 📝 Marcar como sucio
        setDirty: (dirty) => {
          set({ isDirty: dirty });
        },

        // 🔢 Obtener valor numérico
        getNumericValue: (field) => {
          const value = get().formData[field];
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const num = parseFloat(value);
            return !isNaN(num) ? num : undefined;
          }
          return undefined;
        },

        // 💰 Formatear valor para display
        getFormattedValue: (field, format = 'decimal') => {
          const value = get().getNumericValue(field);
          if (value === undefined) return '';
          
          switch (format) {
            case 'currency':
              return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(value);
            
            case 'percentage':
              return `${value.toFixed(2)}%`;
            
            case 'decimal':
            default:
              return value.toFixed(2);
          }
        },

        // ✅ Validar formulario
        isValid: () => {
          const { formData, error } = get();
          return !error && Object.keys(formData).length > 0;
        },

        // 📋 Obtener campos modificados
        getChangedFields: () => {
          const { formData } = get();
          return Object.entries(formData).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              acc[key as keyof NumericFormData] = value;
            }
            return acc;
          }, {} as Partial<NumericFormData>);
        },
      }),
      {
        name: 'numeric-form-storage',
        partialize: (state) => ({ 
          formData: state.formData,
          isDirty: state.isDirty 
        }),
      }
    ),
    {
      name: 'NumericFormStore',
    }
  )
);