import type { RoadmapNode } from "./types";
import { konuBul } from "./store";

export const renkler = [
    { accent: "#db6c8a", accentBg: "#fce7f3", accentDark: "#f2a8c0", accentBgDark: "rgba(242, 168, 192, 0.18)" },
    { accent: "#5b8fd1", accentBg: "#dbe9fb", accentDark: "#8fb8ea", accentBgDark: "rgba(143, 184, 234, 0.18)" },
    { accent: "#6fb98f", accentBg: "#e0f5e7", accentDark: "#9edcb5", accentBgDark: "rgba(158, 220, 181, 0.18)" },
    { accent: "#c9a15c", accentBg: "#faf0dc", accentDark: "#e8c98a", accentBgDark: "rgba(232, 201, 138, 0.18)" },
    { accent: "#9b8fd1", accentBg: "#ece8fb", accentDark: "#bdb3ea", accentBgDark: "rgba(189, 179, 234, 0.18)" },
    { accent: "#e0977a", accentBg: "#fbe9e0", accentDark: "#f0b39c", accentBgDark: "rgba(240, 179, 156, 0.18)" },
];

export function kokIndexBul(roadmaps: RoadmapNode[], id: number): number {
    for (let i = 0; i < roadmaps.length; i++) {
        if (konuBul([roadmaps[i]], id)) {
            return i;
        }
    }
    return 0;
}