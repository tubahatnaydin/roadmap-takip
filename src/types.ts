export type Status = "Başlanmadı" | "Devam Ediliyor" | "Tamamlandı";

export interface RoadmapNode {
    id: number;
    title: string;
    status: Status;
    children: RoadmapNode[];
    description?: string;
    resources?: string[];
    selectable?: boolean;
    isHidden?: boolean;
    connection?: boolean;
}
