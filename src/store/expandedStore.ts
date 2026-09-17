import { create } from 'zustand'

interface ExpandedStore {
    expandedMap: Record<number, boolean>;
    setExpanded: (id: number, expanded: boolean) => void;
}

export const useExpandedStore = create<ExpandedStore>((set) => ({

    expandedMap: {},
    setExpanded: (id, expanded) => set((state) => ({
        expandedMap: { ...state.expandedMap, [id]: expanded }
    })),

}));
