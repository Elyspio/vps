import {copyFileSync, existsSync, mkdirSync, promises, renameSync, unlinkSync, writeFileSync} from "fs";
import {platform} from "os";
import * as nodePath from "path";
import {join, sep} from "path";
import {FileFormats} from "../storage/file/FileFormats";

const mkdir = promises.mkdir;
const lstat = promises.lstat;

export function mkdirRecursiveSync(path: string) {
    const splited = path.split(nodePath.sep);
    for (let i = 0; i < splited.length; i++) {
        let str = "";
        if (platform() === "linux") {
            str = sep;
        }
        str += join(...splited.slice(0, i + 1));
        if (!existsSync(str)) {
            mkdirSync(str);
        }
    }
}

export function moveCrossDevice(oldPath: string, newPath: string) {
    try {
        renameSync(oldPath, newPath);
    } catch (e) {
        copyFileSync(oldPath, newPath);
        unlinkSync(oldPath);
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
        } catch (e) {
            throw e;
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
