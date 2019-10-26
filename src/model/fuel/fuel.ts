import * as extract from "extract-zip";
import * as fs from "fs";
import {xml2json} from "xml-js";
import {download} from "../common";

const cache = `${__dirname}/cache`;

export let downloadData = async (x: any) => {

    download(x.gouv, `${x.pathToZip}`).then((filepath: string) => {
        extract(filepath, {dir: `${__dirname}${cache.slice(1)}/${x.folder}`}, (err) => {
            if (err) {
                throw err;
            }
            fs.readdir(`${cache}/${x.folder}`, ((err1, data) => {
                data.filter((xml) => xml.includes("PrixCarburants")).forEach((xml) => {
                    fs.renameSync(`${cache}/${x.folder}/${xml}`, `${cache}/${x.folder}/${x.filename}.xml`);
                    const xmlStr = fs.readFileSync(x.pathToXml, {encoding: "latin1"});
                    fs.writeFile(x.pathToJson, xml2json(xmlStr, {compact: true}), ((error: any) => {
                        if (error) { throw error; }
                    }));
                });
            }));
        });

    }).catch((e) => {throw  e; });

};
