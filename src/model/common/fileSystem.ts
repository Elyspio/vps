import {existsSync, mkdirSync, promises, writeFileSync} from "fs";
import * as nodePath from "path";
import {join, sep} from "path";
import {FileFormats} from "../storage/storage";

const mkdir = promises.mkdir;
const lstat = promises.lstat;

export namespace FileSystem {

    export function mkdirRecursiveSync(path: string) {
        const splited = path.split(nodePath.sep);
        for (let i = 0; i < splited.length; i++) {
            let str: string = sep;
            str += join(...splited.slice(0, i + 1));
            if (!existsSync(str)) {
                mkdirSync(str);
            }
        }
    }

    export async function mkdirRecursive(path: string) {
        const splited = path.split(nodePath.sep);
        for (let i = 0; i < splited.length; i++) {
            let str: string = sep;
            str += join(...splited.slice(0, i + 1));
            try {
                await lstat(str);
                await mkdir(str);
            } catch (_) {
            }
        }

    }

    export function touchSync(path: string, format: FileFormats) {
        const splited = path.split(nodePath.sep);
        mkdirRecursiveSync(join(...splited.slice(0, splited.length - 1)));
        if (!existsSync(path)) {
            let data;
            switch (format) {
                case FileFormats.JSON:
                    data = "{}";
                    break;
                default:
                    data = "";
                    break;

            }
            writeFileSync(path, data);

        }
    }

}
