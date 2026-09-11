import { useState } from "react";
import type { CSSProperties } from "react";
import { useRoadmapStore } from "./store";
import { useTemaStore } from "./temaStore";
import KonuSatiri from "./KonuSatiri";
import { renkler } from "./renkler";
import { useScrollRestorasyon } from "./useScrollRestorasyon";

function AnaSayfa() {
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const roadmapEkle = useRoadmapStore((state) => state.roadmapEkle);
    const tema = useTemaStore((state) => state.tema);
    const [yeniKonuBaslik, setYeniKonuBaslik] = useState("");
    useScrollRestorasyon();

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    Yol Haritan
                </h1>
                <p className="text-stone-500 dark:text-stone-400 mt-2">
                    Öğrenme yolculuğunu takip et, ilerlemeni işaretle.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-8 max-w-md mx-auto">
                <input
                    type="text"
                    value={yeniKonuBaslik}
                    onChange={(e) => setYeniKonuBaslik(e.target.value)}
                    placeholder="Yeni roadmap adı (örn. Backend Developer)"
                    className="flex-1 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button
                    onClick={() => {
                        if (!yeniKonuBaslik.trim()) {
                            return;
                        }
                        roadmapEkle(yeniKonuBaslik);
                        setYeniKonuBaslik("");
                    }}
                    className="px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                    + Roadmap Ekle
                </button>
            </div>

            <div className="flex flex-col gap-5">
                {roadmaps.map((roadmap, index) => {
                    const renk = renkler[index % renkler.length];
                    return (
                        <div
                            key={roadmap.id}
                            style={{
                                "--accent": tema === "dark" ? renk.accentDark : renk.accent,
                                "--accent-bg": tema === "dark" ? renk.accentBgDark : renk.accentBg,
                            } as CSSProperties}
                            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4"
                        >
                            <KonuSatiri node={roadmap} kokMu={true} renkIndex={index} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
export default AnaSayfa;
