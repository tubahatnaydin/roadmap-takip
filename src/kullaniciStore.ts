import { persist } from 'zustand/middleware'
import { create } from 'zustand'

interface Kullanici {
    ad: string;
    email: string;
}

interface KayitliHesap extends Kullanici {
    sifre: string;
}

interface KullaniciStore {
    kullanici: Kullanici | null;
    kayitliHesaplar: KayitliHesap[];
    kayitOl: (ad: string, email: string, sifre: string) => void;
    girisYap: (email: string, sifre: string) => boolean;
    cikisYap: () => void;
}

export const useKullaniciStore = create<KullaniciStore>()(
    persist(
        (set, get) => ({

            kullanici: null,
            kayitliHesaplar: [],
            kayitOl: (ad, email, sifre) => set((state) => ({
                kullanici: { ad, email },
                kayitliHesaplar: [...state.kayitliHesaplar, { ad, email, sifre }],
            })),
            girisYap: (email, sifre) => {
                const hesap = get().kayitliHesaplar.find((h) => h.email === email && h.sifre === sifre);
                if (!hesap) {
                    return false;
                }
                set({ kullanici: { ad: hesap.ad, email: hesap.email } });
                return true;
            },
            cikisYap: () => set({ kullanici: null }),

        }),
        {
            name: 'kullanici-storage',
        }
    )
);