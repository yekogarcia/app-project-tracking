export interface IAccount {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  company: any;
  avatar?: string;
}
export interface IAuthState {
  account: IAccount | null;
  isAuthenticated: boolean;
}

export interface IStoreAuth {
  account: IAccount;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionStarted: boolean;
  login: (account: IAccount) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setSessionStarted: (started: boolean) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  type: 'PERSONA' | 'EMPRESA';
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
}

// Re-export form types from local schemas
export type { LoginFormData, RegisterFormData } from '../schemas';
