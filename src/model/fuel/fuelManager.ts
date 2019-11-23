import {readFileSync} from "fs";
import {xml2json, } from "xml-js";
import {FileStorage} from "../storage/file/FileStorage";
import {Zip} from "../util/Zip";

export class FuelManager {

    public static async fetchDailyFuels() {
        const filepath = await this.fetchFuel("daily", "https://donnees.roulez-eco.fr/opendata/jour");
        return filepath;
    }

    public static async fetchYearlyFuels(year: number) {
        const filepath = await this.fetchFuel(`year-${year}`, `https://donnees.roulez-eco.fr/opendata/annee/${year}`);
        return filepath;
    }

    public static async fetchInstantFuels() {
        const filepath = await this.fetchFuel("instant", "https://donnees.roulez-eco.fr/opendata/instantane");
        return filepath;
    }

    private static async fetchFuel(name, url) {
        const filepath = await FileStorage.store.download(url, `${name}.zip`);
        const xmlPath = new Zip().extract(`${name}.zip`, `${name}.xml`, {deleteAfter: true, folder: null});
        const json = xml2json(readFileSync(xmlPath, {encoding: "latin1"}).toString());
        FileStorage.store.put(`${name}.json`, json);
        return filepath;
    }
}

