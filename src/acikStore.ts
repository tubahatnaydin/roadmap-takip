import { create } from 'zustand'

interface AcikStore {
    acikMap: Record<number, boolean>;
    setAcik: (id: number, acik: boolean) => void;
}

export const useAcikStore = create<AcikStore>((set) => ({

    acikMap: {},
    setAcik: (id, acik) => set((state) => ({
        acikMap: { ...state.acikMap, [id]: acik }
    })),

}));