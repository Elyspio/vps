import {existsSync, readFileSync, writeFileSync} from "fs";
import {homedir} from "os";
import {join} from "path";
import {APP_NAME} from "../../config/config";
import {FileSystem} from "../common/fileSystem";
import {UnknownJsonKey} from "./errors/UnknownJsonKey";

const touchSync = FileSystem.touchSync;
export type Jsonable = string | number | boolean | null | object;

export enum StorageFiles {
    setting = "settings.json",
    data = "data.json",
}

export enum FileFormats {
    JSON,
}

export class Storage {

    private static instance: Storage;
    protected moduleKey: string = null;
    private readonly appFolder: string;

    constructor() {
        this.appFolder = join(homedir(), ".local", APP_NAME);
        FileSystem.mkdirRecursiveSync(this.appFolder);
        // @ts-ignore
        Object.keys(StorageFiles).map((key) => StorageFiles[key]).forEach((filename) => {
            touchSync(join(this.appFolder, filename), FileFormats.JSON);
        });
    }

    static get store(): Storage {
        if (Storage.instance === undefined) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    protected get(file: StorageFiles, ...keys: string[]) {

        const filepath = join(this.appFolder, file);

        if (existsSync(filepath)) {
            let current = JSON.parse(readFileSync(filepath).toString());
            keys.forEach((key) => {
                if (key in current) {
                    current = current[key];
                } else {
                    throw new UnknownJsonKey(current, key);
                }
            });
            return current;
        }

    }

    protected delete(file: StorageFiles, ...keys: string[]) {

        const filepath = join(this.appFolder, file);
        const rootObject = this.get(file);

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

    protected put(file: StorageFiles, obj: Jsonable, ...keys: string[]) {

        if (this.moduleKey != null) {
            keys = [this.moduleKey, ...keys];
        }

        const filepath = join(this.appFolder, file);
        let rootObject = this.get(file);

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
