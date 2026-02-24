import { create } from "zustand";
import type { IAccount, IStoreAuth } from "../types";

const valuesAuthStore = {
  id: 0,
  name: '',
  phone: '',
  email: '',
  role: '',
  company: {}
};

export const useAuthStore = create<IStoreAuth>((set) => ({
  account: valuesAuthStore,
  isAuthenticated: false,
  isLoading: true,
  sessionStarted: false,
  login: (account: IAccount) =>
    set(() => (
      {
        account: { ...valuesAuthStore, ...account },
        isAuthenticated: true,
        isLoading: false,
        sessionStarted: true
      }
    )),
  logout: () => set(() => ({ 
    account: valuesAuthStore, 
    isAuthenticated: false,
    isLoading: false 
  })),
  setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
  setSessionStarted: (started: boolean) => set(() => ({ sessionStarted:   started }))
}));
