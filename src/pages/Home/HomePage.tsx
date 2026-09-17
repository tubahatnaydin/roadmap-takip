import { useState } from "react";
import type { CSSProperties } from "react";
import { useRoadmapStore } from "../../store/roadmapStore";
import { useThemeStore } from "../../store/themeStore";
import TopicRow from "../../components/TopicRow";
import { colors } from "../../utils/colors";
import { useScrollRestore } from "../../hooks/useScrollRestore";

function HomePage() {
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const addRoadmap = useRoadmapStore((state) => state.addRoadmap);
    const theme = useThemeStore((state) => state.theme);
    const [newRoadmapTitle, setNewRoadmapTitle] = useState("");
    useScrollRestore();

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
                    value={newRoadmapTitle}
                    onChange={(e) => setNewRoadmapTitle(e.target.value)}
                    placeholder="Yeni roadmap adı (örn. Backend Developer)"
                    className="flex-1 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button
                    onClick={() => {
                        if (!newRoadmapTitle.trim()) {
                            return;
                        }
                        addRoadmap(newRoadmapTitle);
                        setNewRoadmapTitle("");
                    }}
                    className="px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                    + Roadmap Ekle
                </button>
            </div>

            <div className="flex flex-col gap-5">
                {roadmaps.map((roadmap, index) => {
                    const color = colors[index % colors.length];
                    return (
                        <div
                            key={roadmap.id}
                            style={{
                                "--accent": theme === "dark" ? color.accentDark : color.accent,
                                "--accent-bg": theme === "dark" ? color.accentBgDark : color.accentBg,
                            } as CSSProperties}
                            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4"
                        >
                            <TopicRow node={roadmap} isRoot={true} colorIndex={index} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}
export default HomePage;
