import type { CSSProperties } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useRoadmapStore } from "../../store/roadmapStore";
import { useThemeStore } from "../../store/themeStore";
import TopicRow from "../../components/TopicRow";
import { colors, findRootIndex } from "../../utils/colors";
import { useScrollRestore } from "../../hooks/useScrollRestore";

function RoadmapOpenPage() {
    const { id } = useParams();
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const theme = useThemeStore((state) => state.theme);
    const location = useLocation();
    useScrollRestore();

    const roadmapId = Number(id);
    const roadmap = roadmaps.find((r) => r.id === roadmapId);

    const incomingColorIndex = (location.state as { colorIndex?: number } | null)?.colorIndex;
    const colorIndex = incomingColorIndex ?? findRootIndex(roadmaps, roadmapId);
    const color = colors[colorIndex % colors.length];

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
                "--accent": theme === "dark" ? color.accentDark : color.accent,
                "--accent-bg": theme === "dark" ? color.accentBgDark : color.accentBg,
            } as CSSProperties}
        >
            <Link
                to="/"
                className="text-sm text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
            >
                ← Tüm roadmap'ler
            </Link>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 mt-3">
                <TopicRow
                    node={roadmap}
                    isRoot={true}
                    colorIndex={colorIndex}
                    initiallyExpanded={true}
                    backPath={`/ac/${roadmap.id}`}
                    backLabel={`${roadmap.title}'e Dön`}
                />
            </div>
        </div>
    );
}

export default RoadmapOpenPage;
