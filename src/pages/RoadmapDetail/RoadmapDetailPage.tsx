import { useParams, Link, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { useRoadmapStore, findTopic } from "../../store/roadmapStore";
import { useThemeStore } from "../../store/themeStore";
import { colors, findRootIndex } from "../../utils/colors";
import type { RoadmapNode, Status } from "../../types";
import { useScrollRestore } from "../../hooks/useScrollRestore";

function getTotalCount(node: RoadmapNode): number {
    if (node.children.length === 0) {
        return 1;
    }
    if (node.selectable) {
        return 1;
    }
    let total = 0;
    node.children.forEach((child) => {
        total = total + getTotalCount(child);
    });
    return total;
}

function getCompletedCount(node: RoadmapNode): number {
    if (node.children.length === 0) {
        return node.status === "Tamamlandı" ? 1 : 0;
    }
    if (node.selectable) {
        const isOneCompleted = node.children.some(
            (child) => getCompletedCount(child) === getTotalCount(child)
        );
        return isOneCompleted ? 1 : 0;
    }
    let total = 0;
    node.children.forEach((child) => {
        total = total + getCompletedCount(child);
    });
    return total;
}

function isAnyInProgress(node: RoadmapNode): boolean {
    if (node.children.length === 0) {
        return node.status === "Devam Ediliyor";
    }
    return node.children.some((child) => isAnyInProgress(child));
}

function getDisplayStatus(node: RoadmapNode): Status {
    if (node.children.length === 0) {
        return node.status;
    }
    const percentage = Math.round((getCompletedCount(node) / getTotalCount(node)) * 100);
    if (percentage === 100) {
        return "Tamamlandı";
    }
    if (percentage === 0 && !isAnyInProgress(node)) {
        return "Başlanmadı";
    }
    return "Devam Ediliyor";
}

const statusColors = {
    "Başlanmadı": "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
    "Devam Ediliyor": "bg-[var(--accent-bg)] text-[var(--accent)]",
    "Tamamlandı": "bg-[var(--accent)] text-white",
};

function RoadmapDetailPage() {
    const { id } = useParams();
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const topic = findTopic(roadmaps, Number(id));
    const theme = useThemeStore((state) => state.theme);
    const location = useLocation();
    useScrollRestore();
    const locationState = location.state as { colorIndex?: number; backPath?: string; backLabel?: string } | null;
    const incomingColorIndex = locationState?.colorIndex;
    const backPath = locationState?.backPath ?? "/";
    const backLabel = locationState?.backLabel ?? "Ana Sayfaya Dön";

    if (!topic) {
        return (
            <div className="text-center text-stone-500 dark:text-stone-400 mt-10">
                Konu bulunamadı.{" "}
                <Link to="/" className="text-[var(--accent)]">
                    Ana sayfaya dön
                </Link>
            </div>
        );
    }

    const status = getDisplayStatus(topic);
    const color = colors[(incomingColorIndex ?? findRootIndex(roadmaps, topic.id)) % colors.length];

    return (
        <div
            className="max-w-2xl mx-auto"
            style={{
                "--accent": theme === "dark" ? color.accentDark : color.accent,
                "--accent-bg": theme === "dark" ? color.accentBgDark : color.accentBg,
            } as CSSProperties}
        >
            <Link to={backPath} className="text-sm text-stone-400 hover:text-[var(--accent)] transition">← {backLabel}</Link>

            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 mt-3">
                <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100">{topic.title}</h1>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                    {status}
                </span>

                {topic.description && (
                    <p className="mt-4 text-stone-700 dark:text-stone-300 leading-relaxed">{topic.description}</p>
                )}

                {topic.resources && topic.resources.length > 0 && (
                    <div className="mt-6">
                        <h2 className="font-semibold mb-2 text-stone-900 dark:text-stone-100">Kaynaklar</h2>
                        <ul className="space-y-2">
                            {topic.resources.map((resource) => (
                                <li key={resource}>
                                    <a href={resource} target="_blank" rel="noreferrer" className="block text-sm text-[var(--accent)] hover:underline bg-[var(--accent-bg)] rounded-lg px-3 py-2 truncate">
                                        {resource}
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

export default RoadmapDetailPage;
