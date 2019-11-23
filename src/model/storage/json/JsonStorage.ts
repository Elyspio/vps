import {existsSync, readFileSync, writeFileSync} from "fs";
import {join} from "path";
import {touchSync} from "../../util/fileSystem";
import {FileFormats} from "../file/FileFormats";
import {Store} from "../store";
import {UnknownJsonKey} from "./errors/UnknownJsonKey";

export type Jsonable = string | number | boolean | null | object;

export enum StorageFiles {
    setting = "settings.json",
    data = "data.json",
}

export interface StorageOptions {
    createIfNotExist: boolean;
}

const defaultStorageOptions: { get: StorageOptions, put: StorageOptions } = {
    get: {
        createIfNotExist: false,
    },
    put: {
        createIfNotExist: true,
    },
};

/**
 *  Read and store json data for the application.
 *  @singloton
 */
export class JsonStorage extends Store {

    private static instance: JsonStorage;

    protected currentModule = "json";

    protected moduleKey: string = null;

    constructor() {
        super();

        Object.keys(StorageFiles).map((key) => StorageFiles[key]).forEach((filename) => {
            touchSync(join(this.currentPath, filename), FileFormats.JSON);
        });
    }

    static get store(): JsonStorage {
        if (JsonStorage.instance === undefined) {
            JsonStorage.instance = new JsonStorage();
        }
        return JsonStorage.instance;
    }

    /**
     * Get data from a json encoded file
     * @return {object} data stored in json
     * @param file
     * @param keys
     * @param options
     */
    // @ts-ignore
    protected get(file: StorageFiles, keys: string[], options: StorageOptions = defaultStorageOptions.get) {

        const filepath = join(this.currentPath, file);
        if (this.moduleKey !== null && keys[0] !== this.moduleKey) {
            keys = [this.moduleKey, ...keys];
        }

        if (existsSync(filepath)) {
            let current = JSON.parse(readFileSync(filepath).toString());
            keys.forEach((key) => {
                if (!(key in current) && options.createIfNotExist) {
                    current[key] = {};
                }
                if (key in current) {
                    current = current[key];
                } else {
                    throw new UnknownJsonKey(current, key);
                }
            });
            return current;
        }

    }

    /**
     * Delete an entry in a file
     * @param file file to be deleted
     * @param keys the entry to be deleted
     */
    protected delete(file: StorageFiles, keys: string[]) {

        const filepath = join(this.currentPath, file);
        const rootObject = JsonStorage.store.get(file, keys, defaultStorageOptions.get);

        let nObj = rootObject;
        if (keys.length > 0) {
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!(key in nObj)) {
                    throw new UnknownJsonKey(rootObject, key);
                }
                nObj = nObj[key];
            }
            delete nObj[keys[keys.length - 1]];
        }

        writeFileSync(filepath, JSON.stringify(rootObject));

    }

    /**
     * Insert an entry in a file
     * @param file file to be deleted
     * @param obj {object} object to be added
     * @param keys the entry to be deleted
     */
    // @ts-ignore
    protected put(file: StorageFiles, obj: Jsonable, keys: string[]) {
        if (this.moduleKey != null) {
            keys = [this.moduleKey, ...keys];
        }
        const filepath = join(this.currentPath, file);

        let rootObject = JsonStorage.store.get(file, []);

        let nObj = rootObject;
        if (keys.length > 0) {
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!(key in nObj)) {
                    nObj[key] = {};
                }
                nObj = nObj[key];
            }
            nObj[keys[keys.length - 1]] = obj;
        } else {
            if (typeof obj === "object") {
                rootObject = {...rootObject, ...obj};
            } else {
                rootObject = {...rootObject, obj};
            }
        }
        writeFileSync(filepath, JSON.stringify(rootObject));

    }

}
