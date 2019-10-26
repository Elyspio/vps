import Axios from "axios";
import {createWriteStream} from "fs";

export async function download(url: string, path: string) {
    // path = resolve(path);
    const writer = createWriteStream(path);

    const response = await Axios({
        method: "GET",
        responseType: "stream",
        url,
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("open", () => {
            writer.on("finish", () => {
                writer.close();
                resolve();
            });
            writer.on("error", reject);
        });
    });
}
