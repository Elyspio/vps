import {exec} from "child_process";
import {createReadStream, PathLike, readFileSync, ReadStream, writeFileSync} from 'fs';
import {join} from "path";
import {Store} from "../store";

enum OutputFormat {
    STREAM,
    STRING,
}

export class FileStorage extends Store {

    private static instance;

    protected currentModule = "files";

    constructor() {
        super("files");

    }

    public static get store(): FileStorage {
        if (!FileStorage.instance) {
            FileStorage.instance = new FileStorage();
        }
        return FileStorage.instance;
    }

    public getPath(file: PathLike) {
        return join(this.currentPath, file.toString());
    }

    public async download(url: string, output: string) {

        return new Promise<string>((resolve) => {
            const path = this.getPath(output);
            exec(`wget ${url} -O ${path}`, () => {
                resolve(path);
            });
        });
    }

    // @ts-ignore
    public get(filePath: string, format = OutputFormat.STRING): ReadStream | string {
        const realPath = this.getPath(filePath);

        switch (format) {
            case OutputFormat.STRING:
                return readFileSync(realPath).toString();
            case OutputFormat.STREAM:
                return createReadStream(realPath);
        }
    }

    // @ts-ignore
    public put(filePath: string, data: any) {
        const realPath = this.getPath(filePath);
        writeFileSync(realPath, data);
    }

}
