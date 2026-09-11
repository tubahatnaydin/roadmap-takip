import { persist } from 'zustand/middleware'
import { create } from 'zustand'

interface TemaStore {
    tema: "light" | "dark";
    temaDegistir: () => void;
}

export const useTemaStore = create<TemaStore>()(
    persist(
        (set) => ({

        tema: "light",
        temaDegistir: () => set((state) => ({
            tema: state.tema === "light" ? "dark" : "light"
        })),
        
        }),
        {
            name: 'tema-storage',
        }
    )
);
