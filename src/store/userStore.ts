import { persist } from 'zustand/middleware'
import { create } from 'zustand'

interface User {
    name: string;
    email: string;
}

interface SavedAccount extends User {
    password: string;
}

interface UserStore {
    user: User | null;
    savedAccounts: SavedAccount[];
    register: (name: string, email: string, password: string) => void;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({

            user: null,
            savedAccounts: [],
            register: (name, email, password) => set((state) => ({
                user: { name, email },
                savedAccounts: [...state.savedAccounts, { name, email, password }],
            })),
            login: (email, password) => {
                const account = get().savedAccounts.find((a) => a.email === email && a.password === password);
                if (!account) {
                    return false;
                }
                set({ user: { name: account.name, email: account.email } });
                return true;
            },
            logout: () => set({ user: null }),

        }),
        {
            name: 'user-storage',
        }
    )
);
