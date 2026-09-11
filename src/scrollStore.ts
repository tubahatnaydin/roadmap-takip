import { create } from 'zustand'

interface ScrollStore {
    pozisyonlar: Record<string, number>;
    pozisyonKaydet: (yol: string, y: number) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({

    pozisyonlar: {},
    pozisyonKaydet: (yol, y) => set((state) => ({
        pozisyonlar: { ...state.pozisyonlar, [yol]: y }
    })),

}));