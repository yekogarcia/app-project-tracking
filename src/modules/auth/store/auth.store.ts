import { create } from "zustand";
import type { IAccount, IStoreAuth } from "../types";

const valuesAuthStore = {
  id: 0,
  name: '',
  email: '',
  role: '',
  company_id: 0
};

export const useAuthStore = create<IStoreAuth>((set) => ({
  account: valuesAuthStore,
  isAuthenticated: false,
  isLoading: true, // 🔥 Inicia en true para esperar la validación
  login: (account: IAccount) =>
    set(() => (
      {
        account: { ...valuesAuthStore, ...account },
        isAuthenticated: true,
        isLoading: false
      }
    )),
  logout: () => set(() => ({ 
    account: valuesAuthStore, 
    isAuthenticated: false,
    isLoading: false 
  })),
  setLoading: (loading: boolean) => set(() => ({ isLoading: loading }))
}));
