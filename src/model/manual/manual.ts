export enum ManualCategories {
    NETWORK = "network",
    SYSTEM = "system",
    SOFTWARE = "software",
    OTHER = "other",
    ALL = "all",
}

export interface Manual {
    title: string;
    text: string[];
    categorie: ManualCategories;
}
