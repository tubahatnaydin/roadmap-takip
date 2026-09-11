export type Durum = "Başlanmadı" | "Devam Ediliyor" | "Tamamlandı";

export interface RoadmapNode {
    id: number;
    baslik: string;
    durum: Durum;
    children: RoadmapNode[];
    aciklama?: string;
    kaynaklar?: string[];
    secilebilir?: boolean;
    gizliMi?: boolean;
    baglanti?: boolean;
}
