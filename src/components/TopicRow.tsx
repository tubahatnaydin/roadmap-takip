import { useState } from "react";
import { Link } from "react-router-dom";
import type { RoadmapNode, Status } from "../types";
import { useRoadmapStore, findTopic } from "../store/roadmapStore";
import { useExpandedStore } from "../store/expandedStore";

const suggestedResources: Record<number, number[]> = {
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
    isRoot?: boolean;
    depth?: number;
    colorIndex?: number;
    initiallyExpanded?: boolean;
    backPath?: string;
    backLabel?: string;
}

function getNextStatus(status: Status): Status {

    if (status === "Başlanmadı") {
        return "Devam Ediliyor";
    }
    else if (status === "Devam Ediliyor") {
        return "Tamamlandı";
    }
    else {
        return "Başlanmadı";
    }
}

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

function getChildTopicIds(node: RoadmapNode): number[] {
    let ids: number[] = [];
    node.children.forEach((child) => {
        if (child.selectable) {
            return;
        }
        ids.push(child.id);
        ids = ids.concat(getChildTopicIds(child));
    });
    return ids;
}

function hasSelectableChild(node: RoadmapNode): boolean {
    return node.children.some((child) => child.selectable || hasSelectableChild(child));
}

const statusIconColors = {
    "Başlanmadı": "text-stone-300 dark:text-stone-600",
    "Devam Ediliyor": "text-[var(--accent)]/60",
    "Tamamlandı": "text-[var(--accent)]",
};


function TopicRow({ node, isRoot, depth, colorIndex, initiallyExpanded, backPath, backLabel }: Props) {

    const level = depth ?? 0;

    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const addTopic = useRoadmapStore((state) => state.addTopic);
    const deleteTopic = useRoadmapStore((state) => state.deleteTopic);
    const [newTopicTitle, setNewTopicTitle] = useState("");
    const expandedMap = useExpandedStore((state) => state.expandedMap);
    const setExpandedGlobal = useExpandedStore((state) => state.setExpanded);
    const defaultExpanded = initiallyExpanded ?? !isRoot;
    const expanded = expandedMap[node.id] ?? defaultExpanded;
    const [isAddOpen, setIsAddOpen] = useState(false);


    const updateStatus = useRoadmapStore((state) => state.updateStatus);

    const hasChildren = node.children.length > 0;
    const triggers = suggestedResources[node.id];
    const isSuggested = triggers?.some((id) => {
        const triggerTopic = findTopic(roadmaps, id);
        if (!triggerTopic) {
            return false;
        }
        if (triggerTopic.children.length === 0) {
            return triggerTopic.status === "Tamamlandı";
        }
        return getCompletedCount(triggerTopic) === getTotalCount(triggerTopic);
    }) ?? false;
    const percentage = Math.round((getCompletedCount(node) / getTotalCount(node)) * 100);

    let displayStatus: Status;

    if (node.children.length === 0) {
        displayStatus = node.status;
    }
    else if (percentage === 100) {
        displayStatus = "Tamamlandı";
    }
    else if (percentage === 0 && !isAnyInProgress(node)) {
        displayStatus = "Başlanmadı";
    }
    else {
        displayStatus = "Devam Ediliyor";
    }

    const titleClass = isRoot
        ? "font-display text-lg font-semibold text-stone-900 dark:text-stone-100"
        : hasChildren
            ? "text-[15px] font-semibold text-stone-900 dark:text-stone-100"
            : "text-sm text-stone-500 dark:text-stone-400";

    return (

        <div className={
            isRoot
                ? ""
                : level === 1
                    ? "mt-4 mb-2 ml-2 pl-4 pr-2 py-3 rounded-xl bg-stone-100/70 dark:bg-stone-800/40"
                    : "pl-4 ml-2 mt-1 border-l border-stone-200 dark:border-stone-800"
        }>

            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                        {hasChildren ? (
                            <button
                                onClick={() => setExpandedGlobal(node.id, !expanded)}
                                aria-label={expanded ? "Alt konuları gizle" : "Alt konuları göster"}
                                className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-xs"
                            >
                                {expanded ? "▾" : "▸"}
                            </button>
                        ) : (
                            <span className="w-5 h-5 flex-shrink-0" />
                        )}

                        {isRoot ? (
                            <Link
                                to={`/ac/${node.id}`}
                                state={{ colorIndex }}
                                className={`${titleClass} hover:text-[var(--accent)] transition`}
                            >
                                {node.title}
                            </Link>
                        ) : (
                            <>
                                {node.selectable || node.connection || hasSelectableChild(node) ? (
                                    <span
                                        title={
                                            node.selectable
                                                ? "Bu durum, seçtiğin alt konuya göre otomatik belirlenir"
                                                : "Bu durum, alt konuları tek tek tamamlayınca otomatik belirlenir"
                                        }
                                        className="flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--accent-bg)] text-[var(--accent)]"
                                    >
                                        {displayStatus}
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (hasChildren) {
                                                const newStatus = displayStatus === "Tamamlandı" ? "Başlanmadı" : "Tamamlandı";
                                                getChildTopicIds(node).forEach((id) => updateStatus(id, newStatus));
                                            } else {
                                                updateStatus(node.id, getNextStatus(node.status));
                                            }
                                        }}
                                        aria-label="Durumu değiştir"
                                        title={`${displayStatus} — tıkla, ilerlet`}
                                        className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-stone-200/60 dark:hover:bg-stone-700/60 hover:scale-110 transition ${statusIconColors[displayStatus]}`}
                                    >
                                        {displayStatus === "Tamamlandı" ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M8.5 12.5l2.5 2.5 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : displayStatus === "Devam Ediliyor" ? (
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

                                <p className={titleClass}>
                                    {node.title}
                                    {node.selectable && (
                                        <span className="ml-1 text-[10px] font-normal text-stone-400 dark:text-stone-500">
                                            (birini seç)
                                        </span>
                                    )}
                                    {node.connection && (
                                        <span className="ml-1 text-[10px] font-normal text-stone-400 dark:text-stone-500">
                                            (bağlı roadmap, alt konulardan takip et)
                                        </span>
                                    )}
                                    {isSuggested && (
                                        <span className="ml-1 text-[10px] font-normal text-[var(--accent)]">
                                            ★ Önerilen
                                        </span>
                                    )}
                                </p>
                            </>
                        )}

                        {isRoot && (
                            <>
                                <Link
                                    to={`/roadmap/${node.id}`}
                                    state={{ colorIndex, backPath, backLabel }}
                                    className="text-xs text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
                                >
                                    Detaylar →
                                </Link>
                                <Link
                                    to={`/akis/${node.id}`}
                                    state={{ colorIndex, backPath, backLabel }}
                                    className="text-xs text-stone-400 hover:text-[var(--accent)] dark:text-stone-500 transition"
                                >
                                    Akış Şeması →
                                </Link>
                            </>
                        )}
                    </div>

                    {!isRoot && (
                        <div className="flex items-center gap-3 mt-1 ml-1">
                            <Link
                                to={`/roadmap/${node.id}`}
                                state={{ colorIndex, backPath, backLabel }}
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
                            setIsAddOpen(!isAddOpen);
                            setExpandedGlobal(node.id, true);
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
                            const message = isRoot
                                ? `"${node.title}" roadmap'ini tamamen silmek istediğine emin misin?`
                                : `"${node.title}" konusunu (ve varsa alt konularını) silmek istediğine emin misin?`;
                            if (window.confirm(message)) {
                                deleteTopic(node.id);
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

            {isRoot && (
                <div className="mt-2">
                    <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-[var(--accent)]/60 transition-all"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {displayStatus} · %{percentage}
                    </p>
                </div>
            )}

            {isAddOpen && (
                <div className="flex gap-1 mt-2 mb-1">

                    <input
                        type="text"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        placeholder={isRoot ? "Konu ekle" : "Alt konu ekle"}
                        autoFocus
                        className="border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />

                    <button
                        onClick={() => {
                            if (!newTopicTitle.trim()) {
                                return;
                            }
                            addTopic(node.id, newTopicTitle);
                            setNewTopicTitle("");
                            setIsAddOpen(false);
                        }}
                        className="text-xs px-2 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-md transition"
                    >
                        Ekle
                    </button>
                    <button
                        onClick={() => setIsAddOpen(false)}
                        className="text-xs px-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                    >
                        ✕
                    </button>
                </div>
            )}

            {expanded && (
                <>
                    {node.children.map((child) => (
                        child.isHidden ? null : (
                            <TopicRow
                                node={child}
                                key={child.id}
                                depth={node.connection ? 1 : level + 1}
                                colorIndex={colorIndex}
                                backPath={backPath}
                                backLabel={backLabel}
                            />
                        )
                    ))}
                </>
            )}
        </div>
    );
}

export default TopicRow;
