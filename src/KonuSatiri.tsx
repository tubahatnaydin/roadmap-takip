import { useState } from "react";
import { Link } from "react-router-dom";
import type { RoadmapNode, Durum } from "./types";
import { useRoadmapStore, konuBul } from "./store";
import { useAcikStore } from "./acikStore";

const onerilenKaynaklar: Record<number, number[]> = {
    78: [80, 81], // Vite önerilir: React veya Vue tamamlandıysa
    79: [82], // Webpack önerilir: Angular tamamlandıysa
    85: [71], // MongoDB önerilir: Node.js tamamlandıysa
    83: [72], // PostgreSQL önerilir: Python tamamlandıysa
    93: [92], // MVVM önerilir: SwiftUI tamamlandıysa
    94: [91], // MVC önerilir: UIKit tamamlandıysa
    100: [92], // SPM önerilir: SwiftUI tamamlandıysa
    99: [91], // CocoaPods önerilir: UIKit tamamlandıysa
    103: [80], // Zustand önerilir: React tamamlandıysa
    104: [81], // Pinia önerilir: Vue tamamlandıysa
    111: [36], // Kubernetes önerilir: Docker tamamlandıysa
    113: [51], // Coroutines önerilir: Jetpack Compose tamamlandıysa
    118: [92], // Swift Concurrency önerilir: SwiftUI tamamlandıysa
    119: [91], // Combine önerilir: UIKit tamamlandıysa
    168: [20], // Vercel önerilir: Next.js (SSR) tamamlandıysa
};

interface Props {
    node: RoadmapNode;
    kokMu?: boolean;
    derinlik?: number;
    renkIndex?: number;
    baslangicAcik?: boolean;
    geriYolu?: string;
    geriBaslik?: string;
}

function sonrakiDurum(durum: Durum): Durum {

    if (durum === "Başlanmadı") {
        return "Devam Ediliyor";
    }
    else if (durum === "Devam Ediliyor") {
        return "Tamamlandı";
    }
    else {
        return "Başlanmadı";
    }
}

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

function altKonularinIdleri(node: RoadmapNode): number[] {
    let idler: number[] = [];
    node.children.forEach((child) => {
        if (child.secilebilir) {
            return;
        }
        idler.push(child.id);
        idler = idler.concat(altKonularinIdleri(child));
    });
    return idler;
}

function altSecimVarMi(node: RoadmapNode): boolean {
    return node.children.some((child) => child.secilebilir || altSecimVarMi(child));
}

const durumIkonRenkleri = {
    "Başlanmadı": "text-stone-300 dark:text-stone-600",
    "Devam Ediliyor": "text-[var(--accent)]/60",
    "Tamamlandı": "text-[var(--accent)]",
};


function KonuSatiri({ node, kokMu, derinlik, renkIndex, baslangicAcik, geriYolu, geriBaslik }: Props) {

    const seviye = derinlik ?? 0;

    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const konuEkle = useRoadmapStore((state) => state.konuEkle);
    const konuSil = useRoadmapStore((state) => state.konuSil);
    const [altKonuBaslik, setAltKonuBaslik] = useState("");
    const acikMap = useAcikStore((state) => state.acikMap);
    const setAcikGlobal = useAcikStore((state) => state.setAcik);
    const varsayilanAcik = baslangicAcik ?? !kokMu;
    const acik = acikMap[node.id] ?? varsayilanAcik;
    const [ekleAcik, setEkleAcik] = useState(false);


    const updateDurum = useRoadmapStore((state) => state.updateDurum);

    const hasChildren = node.children.length > 0;
    const tetikleyiciler = onerilenKaynaklar[node.id];
    const onerildi = tetikleyiciler?.some((id) => {
        const tetikleyiciKonu = konuBul(roadmaps, id);
        if (!tetikleyiciKonu) {
            return false;
        }
        if (tetikleyiciKonu.children.length === 0) {
            return tetikleyiciKonu.durum === "Tamamlandı";
        }
        return tamamlananSayisi(tetikleyiciKonu) === tumKonularinSayisi(tetikleyiciKonu);
    }) ?? false;
    const yuzde = Math.round((tamamlananSayisi(node) / tumKonularinSayisi(node)) * 100);

    let gosterilecekDurum: Durum;

    if (node.children.length === 0) {
        gosterilecekDurum = node.durum;
    }
    else if (yuzde === 100) {
        gosterilecekDurum = "Tamamlandı";
    }
    else if (yuzde === 0 && !herhangiBiriDevamEdiyorMu(node)) {
        gosterilecekDurum = "Başlanmadı";
    }
    else {
        gosterilecekDurum = "Devam Ediliyor";
    }

    const baslikClass = kokMu
        ? "font-display text-lg font-semibold text-stone-900 dark:text-stone-100"
        : hasChildren
            ? "text-[15px] font-semibold text-stone-900 dark:text-stone-100"
            : "text-sm text-stone-500 dark:text-stone-400";

    return (

        <div className={
            kokMu
                ? ""
                : seviye === 1
                    ? "mt-4 mb-2 ml-2 pl-4 pr-2 py-3 rounded-xl bg-stone-100/70 dark:bg-stone-800/40"
                    : "pl-4 ml-2 mt-1 border-l border-stone-200 dark:border-stone-800"
        }>

            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                        {hasChildren ? (
                            <button
                                onClick={() => setAcikGlobal(node.id, !acik)}
                                aria-label={acik ? "Alt konuları gizle" : "Alt konuları göster"}
                                className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-xs"
                            >
                                {acik ? "▾" : "▸"}
                            </button>
                        ) : (
                            <span className="w-5 h-5 flex-shrink-0" />
                        )}

                        {kokMu ? (
                            <Link
                                to={`/ac/${node.id}`}
                                state={{ renkIndex }}
                                className={`${baslikClass} hover:text-[var(--accent)] transition`}
                            >
                                {node.baslik}
                            </Link>
                        ) : (
                            <>
                                {node.secilebilir || node.baglanti || altSecimVarMi(node) ? (
                                    <span
                                        title={
                                            node.secilebilir
                                                ? "Bu durum, seçtiğin alt konuya göre otomatik belirlenir"
                                                : "Bu durum, alt konuları tek tek tamamlayınca otomatik belirlenir"
                                        }
                                        className="flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--accent-bg)] text-[var(--accent)]"
                                    >
                                        {gosterilecekDurum}
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (hasChildren) {
                                                const yeniDurum = gosterilecekDurum === "Tamamlandı" ? "Başlanmadı" : "Tamamlandı";
                                                altKonularinIdleri(node).forEach((id) => updateDurum(id, yeniDurum));
                                            } else {
                                                updateDurum(node.id, sonrakiDurum(node.durum));
                                            }
                                        }}
                                        aria-label="Durumu değiştir"
                                        title={`${gosterilecekDurum} — tıkla, ilerlet`}
                                        className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-stone-200/60 dark:hover:bg-stone-700/60 hover:scale-110 transition ${durumIkonRenkleri[gosterilecekDurum]}`}
                                    >
                                        {gosterilecekDurum === "Tamamlandı" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M8.5 12.5l2.5 2.5 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : gosterilecekDurum === "Devam Ediliyor" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                                <circle cx="12" cy="12" r="9" />
                                            </svg>
                                        )}
                                    </button>
                                )}

                                <p className={baslikClass}>
                                    {node.baslik}
                                    {node.secilebilir && (
                                        <span className="ml-1 text-[10px] font-normal text-stone-400 dark:text-stone-500">
                                            (birini seç)
                                        </span>
                                    )}
                                    {node.baglanti && (
                                        <span className="ml-1 text-[10px] font-normal text-stone-400 dark:text-stone-500">
                                            (bağlı roadmap, alt konulardan takip et)
                                        </span>
                                    )}
                                    {onerildi && (
                                        <span className="ml-1 text-[10px] font-normal text-[var(--accent)]">
                                            ★ Önerilen
                                        </span>
                                    )}
                                </p>
                            </>
                        )}

                        {kokMu && (
                            <>
                                <Link
                                    to={`/roadmap/${node.id}`}
                                    state={{ renkIndex, geriYolu, geriBaslik }}
                                    className="text-xs text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
                                >
                                    Detaylar →
                                </Link>
                                <Link
                                    to={`/akis/${node.id}`}
                                    state={{ renkIndex, geriYolu, geriBaslik }}
                                    className="text-xs text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
                                >
                                    Akış Şeması →
                                </Link>
                            </>
                        )}
                    </div>

                    {!kokMu && (
                        <div className="flex items-center gap-3 mt-1 ml-1">
                            <Link
                                to={`/roadmap/${node.id}`}
                                state={{ renkIndex, geriYolu, geriBaslik }}
                                className="text-xs text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
                            >
                                Detaylar →
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={() => {
                            setEkleAcik(!ekleAcik);
                            setAcikGlobal(node.id, true);
                        }}
                        aria-label="Alt konu ekle"
                        className="w-6 h-6 flex items-center justify-center rounded-full text-stone-300 hover:text-[var(--accent)] hover:bg-stone-100 dark:text-stone-600 dark:hover:bg-stone-800 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                        </svg>
                    </button>

                    <button
                        onClick={() => {
                            const mesaj = kokMu
                                ? `"${node.baslik}" roadmap'ini tamamen silmek istediğine emin misin?`
                                : `"${node.baslik}" konusunu (ve varsa alt konularını) silmek istediğine emin misin?`;
                            if (window.confirm(mesaj)) {
                                konuSil(node.id);
                            }
                        }}
                        aria-label="Sil"
                        className="w-6 h-6 flex items-center justify-center rounded-full text-stone-300 hover:text-rose-400 hover:bg-rose-50 dark:text-stone-600 dark:hover:text-rose-300 dark:hover:bg-rose-900/20 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" />
                        </svg>
                    </button>
                </div>
            </div>

            {kokMu && (
                <div className="mt-2">
                    <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent)]/60 transition-all"
                            style={{ width: `${yuzde}%` }}
                        />
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {gosterilecekDurum} · %{yuzde}
                    </p>
                </div>
            )}

            {ekleAcik && (
                <div className="flex gap-1 mt-2 mb-1">

                    <input
                        type="text"
                        value={altKonuBaslik}
                        onChange={(e) => setAltKonuBaslik(e.target.value)}
                        placeholder={kokMu ? "Konu ekle" : "Alt konu ekle"}
                        autoFocus
                        className="border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />

                    <button
                        onClick={() => {
                            if (!altKonuBaslik.trim()) {
                                return;
                            }
                            konuEkle(node.id, altKonuBaslik);
                            setAltKonuBaslik("");
                            setEkleAcik(false);
                        }}
                        className="text-xs px-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-md transition"
                    >
                        Ekle
                    </button>
                    <button
                        onClick={() => setEkleAcik(false)}
                        className="text-xs px-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    >
                        ✕
                    </button>
                </div>
            )}

            {acik && (
                <>
                    {node.children.map((child) => (
                        child.gizliMi ? null : (
                            <KonuSatiri
                                node={child}
                                key={child.id}
                                derinlik={node.baglanti ? 1 : seviye + 1}
                                renkIndex={renkIndex}
                                geriYolu={geriYolu}
                                geriBaslik={geriBaslik}
                            />
                        )
                    ))}
                </>
            )}
        </div>
    );
}

export default KonuSatiri;