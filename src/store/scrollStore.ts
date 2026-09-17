import { create } from 'zustand'

interface ScrollStore {
    positions: Record<string, number>;
    savePosition: (path: string, y: number) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({

    positions: {},
    savePosition: (path, y) => set((state) => ({
        positions: { ...state.positions, [path]: y }
    })),

}));
