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
    category: ManualCategories;
}

export function getAllCategories() {
    return Object.keys(ManualCategories)
        .filter((catKey) => ManualCategories[catKey] !== ManualCategories.ALL)
        .map((catkey) => ManualCategories[catkey]);
}
