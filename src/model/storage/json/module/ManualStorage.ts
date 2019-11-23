import {getAllCategories, Manual, ManualCategories} from "../../../manual/manual";
import {JsonStorage, StorageFiles} from "../JsonStorage";

interface MManual {
    title: string;
    text: string[];
}

export class ManualStorage extends JsonStorage {

    protected moduleKey = "manual";
    private pathToPages = "pages";

    constructor() {
        super();
        const obj = super.get(StorageFiles.data, [this.pathToPages], {createIfNotExist: true});
        getAllCategories().forEach((cat) => {
            if (!(cat in obj)) {
                obj[cat] = [];
            }
        });
        super.put(StorageFiles.data, obj, [this.pathToPages]);

    }

    /**
     * @description Add or replace a manual in storage
     */
    // @ts-ignore
    public put(manual: Manual): void {
        const obj = super.get(StorageFiles.data, [this.pathToPages], {createIfNotExist: true});

        const current = obj[manual.category].findIndex((elem: MManual) => elem.title === manual.title);
        if (current !== -1) {
            obj[manual.category][current] = {text: manual.text, title: manual.title};
        } else {
            obj[manual.category].push({text: manual.text, title: manual.title});
        }

        super.put(StorageFiles.data, obj, [this.pathToPages]);
    }

    public delete(title: string) {
        super.delete(StorageFiles.data, [title, this.pathToPages]);
    }

    // @ts-ignore
    public get(categorie: ManualCategories = ManualCategories.ALL): Manual[] {
        const entries: any = {};
        if (categorie === ManualCategories.ALL) {
            getAllCategories().forEach((cat) => {
                entries[cat] = super.get(StorageFiles.data, [this.pathToPages, cat]);
            });
        } else {
            entries[categorie] = (super.get(StorageFiles.data, [this.pathToPages, categorie]));
        }

        const output: Manual[][] = [];
        Object.keys(entries).forEach((entry) => {
            output.push(entries[entry].map((e: { text: string[], title: string }) => {
                return {
                    categorie: entry,
                    text: e.text,
                    title: e.title,
                };
            }));
        });
        return output.reduce((tab1, tab2) =>  [...tab1, ...tab2]);
    }

}
