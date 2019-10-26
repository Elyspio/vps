import {Manual, ManualCategories} from "../manual/manual";
import {Storage, StorageFiles} from "./storage";

export class ManualStorage extends Storage {

    protected moduleKey = "manual";
    private pathToPages = "pages";

    // @ts-ignore
    public put(manual: Manual): void {
        super.put(StorageFiles.data, {title: manual.title, text: manual.text}, this.pathToPages, manual.categorie);
    }

    public delete(title: string) {
        super.delete(StorageFiles.data, title, this.pathToPages);
    }

    // @ts-ignore
    public get(categorie: ManualCategories = ManualCategories.ALL): Manual[] {
        const entries: any = {};
        if (categorie === ManualCategories.ALL) {
            Object.keys(ManualCategories).forEach((cat: string) => {
                // @ts-ignore
                entries[cat] = super.get(StorageFiles.data, this.pathToPages, ManualCategories[cat]);
            });
        } else {
            entries[categorie] = (super.get(StorageFiles.data, this.pathToPages, categorie));
        }

        const output: Manual[] = [];
        Object.keys(entries).forEach((entry) => {
            output.push(entries[entry].map((e: { text: string[], title: string }) => {
                return {
                    categorie: entry,
                    text: e.text,
                    title: e.title,
                };
            }));
        });
        return output;
    }

}
