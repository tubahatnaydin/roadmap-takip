import { useParams, Link, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { useRoadmapStore, konuBul } from "./store";
import { useTemaStore } from "./temaStore";
import { renkler, kokIndexBul } from "./renkler";
import type { RoadmapNode, Durum } from "./types";
import { useScrollRestorasyon } from "./useScrollRestorasyon";

function tumKonularinSayisi(node: RoadmapNode): number {
    if (node.children.length === 0) {
        return 1;
    }
    if (node.secilebilir) {
        return 1;
    }
    let toplam = 0;
    node.children.forEach((child) => {
        toplam = toplam + tumKonularinSayisi(child);
    });
    return toplam;
}

function tamamlananSayisi(node: RoadmapNode): number {
    if (node.children.length === 0) {
        return node.durum === "Tamamlandı" ? 1 : 0;
    }
    if (node.secilebilir) {
        const biriTamamlandiMi = node.children.some(
            (child) => tamamlananSayisi(child) === tumKonularinSayisi(child)
        );
        return biriTamamlandiMi ? 1 : 0;
    }
    let toplam = 0;
    node.children.forEach((child) => {
        toplam = toplam + tamamlananSayisi(child);
    });
    return toplam;
}

function herhangiBiriDevamEdiyorMu(node: RoadmapNode): boolean {
    if (node.children.length === 0) {
        return node.durum === "Devam Ediliyor";
    }
    return node.children.some((child) => herhangiBiriDevamEdiyorMu(child));
}

function gosterilecekDurumBul(node: RoadmapNode): Durum {
    if (node.children.length === 0) {
        return node.durum;
    }
    const yuzde = Math.round((tamamlananSayisi(node) / tumKonularinSayisi(node)) * 100);
    if (yuzde === 100) {
        return "Tamamlandı";
    }
    if (yuzde === 0 && !herhangiBiriDevamEdiyorMu(node)) {
        return "Başlanmadı";
    }
    return "Devam Ediliyor";
}

const durumRenkleri = {
    "Başlanmadı": "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
    "Devam Ediliyor": "bg-[var(--accent-bg)] text-[var(--accent)]",
    "Tamamlandı": "bg-[var(--accent)] text-white",
};

function RoadmapDetay() {
    const { id } = useParams();
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const konu = konuBul(roadmaps, Number(id));
    const tema = useTemaStore((state) => state.tema);
    const location = useLocation();
    useScrollRestorasyon();
    const gelenState = location.state as { renkIndex?: number; geriYolu?: string; geriBaslik?: string } | null;
    const gelenRenkIndex = gelenState?.renkIndex;
    const geriYolu = gelenState?.geriYolu ?? "/";
    const geriBaslik = gelenState?.geriBaslik ?? "Ana Sayfaya Dön";

    if (!konu) {
        return (
            <div className="text-center text-stone-500 dark:text-stone-400 mt-10">
                Konu bulunamadı.{" "}
                <Link to="/" className="text-[var(--accent)]">
                    Ana sayfaya dön
                </Link>
            </div>
        );
    }

    const durum = gosterilecekDurumBul(konu);
    const renk = renkler[(gelenRenkIndex ?? kokIndexBul(roadmaps, konu.id)) % renkler.length];

    return (
        <div
            className="max-w-2xl mx-auto"
            style={{
                "--accent": tema === "dark" ? renk.accentDark : renk.accent,
                "--accent-bg": tema === "dark" ? renk.accentBgDark : renk.accentBg,
            } as CSSProperties}
        >
            <Link to={geriYolu} className="text-sm text-stone-400 hover:text-[var(--accent)] transition">← {geriBaslik}</Link>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 mt-3">
                <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">{konu.baslik}</h1>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${durumRenkleri[durum]}`}>
                    {durum}
                </span>

                {konu.aciklama && (
                    <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">{konu.aciklama}</p>
                )}

                {konu.kaynaklar && konu.kaynaklar.length > 0 && (
                    <div className="mt-6">
                        <h2 className="font-semibold mb-2 text-stone-900 dark:text-stone-100">Kaynaklar</h2>
                        <ul className="space-y-2">
                            {konu.kaynaklar.map((kaynak) => (
                                <li key={kaynak}>
                                    <a href={kaynak} target="_blank" rel="noreferrer" className="block text-sm text-[var(--accent)] hover:underline bg-[var(--accent-bg)] rounded-lg px-3 py-2 truncate">
                                        {kaynak}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoadmapDetay;