import type { CSSProperties } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useRoadmapStore } from "./store";
import { useTemaStore } from "./temaStore";
import KonuSatiri from "./KonuSatiri";
import { renkler, kokIndexBul } from "./renkler";
import { useScrollRestorasyon } from "./useScrollRestorasyon";

function RoadmapAcik() {
    const { id } = useParams();
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const tema = useTemaStore((state) => state.tema);
    const location = useLocation();
    useScrollRestorasyon();

    const roadmapId = Number(id);
    const roadmap = roadmaps.find((r) => r.id === roadmapId);

    const gelenRenkIndex = (location.state as { renkIndex?: number } | null)?.renkIndex;
    const renkIndex = gelenRenkIndex ?? kokIndexBul(roadmaps, roadmapId);
    const renk = renkler[renkIndex % renkler.length];

    if (!roadmap) {
        return (
            <div className="text-center text-stone-500 dark:text-stone-400 mt-10">
                Roadmap bulunamadı.{" "}
                <Link to="/" className="text-[var(--accent)]">
                    Ana sayfaya dön
                </Link>
            </div>
        );
    }

    return (
        <div
            className="max-w-2xl mx-auto"
            style={{
                "--accent": tema === "dark" ? renk.accentDark : renk.accent,
                "--accent-bg": tema === "dark" ? renk.accentBgDark : renk.accentBg,
            } as CSSProperties}
        >
            <Link
                to="/"
                className="text-sm text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
            >
                ← Tüm roadmap'ler
            </Link>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 mt-3">
                <KonuSatiri
                    node={roadmap}
                    kokMu={true}
                    renkIndex={renkIndex}
                    baslangicAcik={true}
                    geriYolu={`/ac/${roadmap.id}`}
                    geriBaslik={`${roadmap.baslik}'e Dön`}
                />
            </div>
        </div>
    );
}

export default RoadmapAcik;