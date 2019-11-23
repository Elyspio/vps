import {homedir} from "os";
import {join} from "path";
import {APP_NAME} from "../../config/config";
import {mkdirRecursiveSync} from "../util/fileSystem";

/**
 * Generic class to store data
 */
export abstract class Store  {
    public static readonly appFolder: string = join(homedir(), ".local", APP_NAME);
    protected currentModule;
    protected currentPath;

    /**
     * this.currentModule need to be defined
     */
    protected constructor(current = "") {
        this.currentPath = join(Store.appFolder, this.currentModule || current);
        mkdirRecursiveSync(this.currentPath);
    }

    public abstract get();
    public abstract put();

}
