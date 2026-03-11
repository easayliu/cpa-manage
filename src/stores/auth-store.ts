import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setManagementKey } from "@/api/management-api";

interface AuthState {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: "",
      setApiKey: (key) => {
        setManagementKey(key);
        set({ apiKey: key });
      },
      clearApiKey: () => {
        setManagementKey("");
        set({ apiKey: "" });
      },
    }),
    {
      name: "cpa-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.apiKey) {
          setManagementKey(state.apiKey);
        }
      },
    },
  ),
);
