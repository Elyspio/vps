import {execSync} from "child_process";
import {readdirSync, rmdirSync, unlinkSync} from "fs";
import {join} from "path";
import {FileStorage} from "../storage/file/FileStorage";
import {JsonStorage} from "../storage/json/JsonStorage";
import {mkdirRecursiveSync, moveCrossDevice} from "./fileSystem";

export class Zip {

    /**
     * Extract a file from a zip into the files folder
     * @param input
     * @param output will be moved in files folder
     * @param defaultFolder
     */
    public extract(input, output, {folder = null, deleteAfter = false}) {

        if (folder === null) {
            input = FileStorage.store.getPath(input);
        }
        const tmpFolder = join(JsonStorage.appFolder, "tmp", Date.now().toString());
        mkdirRecursiveSync(tmpFolder);
        execSync(`unzip  ${input} -d ${tmpFolder}`, {cwd: tmpFolder}).toString();

        if (deleteAfter) {
            unlinkSync(input);
        }

        const extractedFile = join(tmpFolder, readdirSync(tmpFolder)[0]);
        const outputPath = FileStorage.store.getPath(output);
        moveCrossDevice(extractedFile, outputPath);

        rmdirSync(tmpFolder);

        return outputPath;

    }

    public compress(input: string, output: string) {
        return null;
    }

}
