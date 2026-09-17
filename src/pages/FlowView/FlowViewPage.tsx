import { Link, useParams, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRoadmapStore, findTopic } from "../../store/roadmapStore";
import { useThemeStore } from "../../store/themeStore";
import { colors, findRootIndex } from "../../utils/colors";
import type { Status, RoadmapNode } from "../../types";
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

const statusStyles: Record<Status, { background: string; color: string; border: string }> = {
    "Başlanmadı": { background: "#f5f5f4", color: "#78716c", border: "1px solid #d6d3d1" },
    "Devam Ediliyor": { background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent)" },
    "Tamamlandı": { background: "var(--accent)", color: "#ffffff", border: "1px solid var(--accent)" },
};

function buildTreeLayout(
    node: RoadmapNode,
    depth: number,
    nodes: any[],
    edges: any[],
    parentId: string | null,
    counter: { value: number },
    theme: "light" | "dark"
) {
    const selfId = String(node.id);
    const y = counter.value * 80;
    counter.value = counter.value + 1;

    const status = getDisplayStatus(node);
    const style = status === "Başlanmadı"
        ? (theme === "dark"
            ? { background: "#292524", color: "#a8a29e", border: "1px solid #44403c" }
            : { background: "#f5f5f4", color: "#78716c", border: "1px solid #d6d3d1" })
        : statusStyles[status];

    nodes.push({
        id: selfId,
        position: { x: depth * 250, y: y },
        data: { label: node.title },
        style: {
            ...style,
            borderRadius: 10,
            padding: "6px 4px",
            fontSize: 13,
            fontWeight: 500,
            width: 200,
        },
    });

    if (parentId) {
        edges.push({
            id: `${parentId}-${selfId}`,
            source: parentId,
            target: selfId,
            type: "smoothstep",
            style: { stroke: "#94a3b8", strokeWidth: 1.5 },
        });
    }

    if (depth < 2) {
        node.children.forEach((child) => {
            buildTreeLayout(child, depth + 1, nodes, edges, selfId, counter, theme);
        });
    }
}

function FlowViewPage() {
    const { id } = useParams();
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const topic = findTopic(roadmaps, Number(id));
    const theme = useThemeStore((state) => state.theme);
    const location = useLocation();
    useScrollRestore();
    const locationState = location.state as { colorIndex?: number; backPath?: string; backLabel?: string } | null;
    const incomingColorIndex = locationState?.colorIndex;
    const incomingBackPath = locationState?.backPath ?? "/";
    const incomingBackLabel = locationState?.backLabel ?? "Ana Sayfaya Dön";

    if (!topic) {
        return (
            <div className="text-center text-stone-500 dark:text-stone-400 mt-10">
                Roadmap bulunamadı.{" "}
                <Link to="/" className="text-[var(--accent)]">
                    Ana sayfaya dön
                </Link>
            </div>
        );
    }

    const nodes: any[] = [];
    const edges: any[] = [];
    const counter = { value: 0 };
    buildTreeLayout(topic, 0, nodes, edges, null, counter, theme);

    const activeColorIndex = incomingColorIndex ?? findRootIndex(roadmaps, topic.id);
    const color = colors[activeColorIndex % colors.length];

    return (
        <div
            style={{
                "--accent": theme === "dark" ? color.accentDark : color.accent,
                "--accent-bg": theme === "dark" ? color.accentBgDark : color.accentBg,
            } as CSSProperties}
        >
            <Link
                to={incomingBackPath}
                className="text-sm text-stone-400 hover:text-[var(--accent)] transition"
            >
                ← {incomingBackLabel}
            </Link>

            <div className="mt-3 h-[75vh] rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                <ReactFlow nodes={nodes} edges={edges} fitView>
                    <Background gap={16} color="#cbd5e1" />
                    <Controls />
                    <MiniMap pannable zoomable />
                </ReactFlow>
            </div>
        </div>
    );
}

export default FlowViewPage;
