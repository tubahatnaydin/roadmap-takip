import { Link, useParams, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRoadmapStore, konuBul } from "./store";
import { useTemaStore } from "./temaStore";
import { renkler, kokIndexBul } from "./renkler";
import type { Durum, RoadmapNode } from "./types";
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

const durumStilleri: Record<Durum, { background: string; color: string; border: string }> = {
    "Başlanmadı": { background: "#f5f5f4", color: "#78716c", border: "1px solid #d6d3d1" },
    "Devam Ediliyor": { background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent)" },
    "Tamamlandı": { background: "var(--accent)", color: "#ffffff", border: "1px solid var(--accent)" },
};

function agacDuzeni(
    node: RoadmapNode,
    derinlik: number,
    nodes: any[],
    edges: any[],
    ustId: string | null,
    sayac: { deger: number },
    tema: "light" | "dark"
) {
    const kendiId = String(node.id);
    const y = sayac.deger * 80;
    sayac.deger = sayac.deger + 1;

    const durum = gosterilecekDurumBul(node);
    const stil = durum === "Başlanmadı"
        ? (tema === "dark"
            ? { background: "#292524", color: "#a8a29e", border: "1px solid #44403c" }
            : { background: "#f5f5f4", color: "#78716c", border: "1px solid #d6d3d1" })
        : durumStilleri[durum];

    nodes.push({
        id: kendiId,
        position: { x: derinlik * 250, y: y },
        data: { label: node.baslik },
        style: {
            ...stil,
            borderRadius: 10,
            padding: "6px 4px",
            fontSize: 13,
            fontWeight: 500,
            width: 200,
        },
    });

    if (ustId) {
        edges.push({
            id: `${ustId}-${kendiId}`,
            source: ustId,
            target: kendiId,
            type: "smoothstep",
            style: { stroke: "#94a3b8", strokeWidth: 1.5 },
        });
    }

    if (derinlik < 2) {
        node.children.forEach((child) => {
            agacDuzeni(child, derinlik + 1, nodes, edges, kendiId, sayac, tema);
        });
    }
}

function AkisGorunumu() {
    const { id } = useParams();
    const roadmaps = useRoadmapStore((state) => state.roadmaps);
    const konu = konuBul(roadmaps, Number(id));
    const tema = useTemaStore((state) => state.tema);
    const location = useLocation();
    useScrollRestorasyon();
    const gelenState = location.state as { renkIndex?: number; geriYolu?: string; geriBaslik?: string } | null;
    const gelenRenkIndex = gelenState?.renkIndex;
    const gelenGeriYolu = gelenState?.geriYolu ?? "/";
    const gelenGeriBaslik = gelenState?.geriBaslik ?? "Ana Sayfaya Dön";

    if (!konu) {
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
    const sayac = { deger: 0 };
    agacDuzeni(konu, 0, nodes, edges, null, sayac, tema);

    const aktifRenkIndex = gelenRenkIndex ?? kokIndexBul(roadmaps, konu.id);
    const renk = renkler[aktifRenkIndex % renkler.length];

    return (
        <div
            style={{
                "--accent": tema === "dark" ? renk.accentDark : renk.accent,
                "--accent-bg": tema === "dark" ? renk.accentBgDark : renk.accentBg,
            } as CSSProperties}
        >
            <Link
                to={gelenGeriYolu}
                className="text-sm text-stone-400 hover:text-[var(--accent)] transition"
            >
                ← {gelenGeriBaslik}
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

export default AkisGorunumu;