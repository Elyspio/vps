// to fetch data
// to transform xml to json
import {Request, Response, Router} from "express";
import * as fs from "fs";
import * as util from "util";

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);

const cache = `${__dirname}/cache`;

export const URLS = {
    daily: {
        help: "Retrieve fuel stations refreshed at midnight",
        path: `/daily`,
    },
    now: {
        help: "Retrieve fuel stations refreshed every 15 mn",
        path: `/now`,
    },
    yearly: {
        help: "Retrieve all data from fuel stations for a year",
        path: `/yearly`,
    },
};

export const router = Router();

router.get(URLS.now.path, (req: Request, res: Response) => {
    now(req, res);
});

router.get(URLS.daily.path, (req, res) => {
    daily(req, res);
});

router.get(URLS.yearly.path, (req, res) => {
    yearly(req, res);
});

/**
 *  @description the differents states / urls of application.
 *  @field url : the url that client ask.
 *  @field gouv : the url where data are fetched.
 *  @field filename : the url of the downloaded file.
 *  @field folder : the url of the folder where the files are downloaded
 *  @field ttl : the number of minutes that server wait before fetch again data.
 *
 */
const STATES = {
    daily: {
        filename: "dataDay",
        folder: `day`,
        gouv: "https://donnees.roulez-eco.fr/opendata/jour",
        ttl: 60 * 12, // 12h
        url: URLS.daily,
    },
    now: {
        filename: "dataNow",
        folder: `now`,
        gouv: "https://donnees.roulez-eco.fr/opendata/instantane",
        ttl: 1, // 1mn,
        url: URLS.now,
    },
    yearly: {
        filename: "dataYear",
        folder: `year`,
        gouv: "https://donnees.roulez-eco.fr/opendata/annee",
        ttl: 60 * 24 * 7, // 7 jours
        url: URLS.yearly,
        // years: [2018, 2019],
        years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
    },

};

// export async function init() {
//
//     fs.access(cache, fs.constants.F_OK, async (err) => {
//         if (err) {
//             await mkdir(cache);
//         }
//         [STATES.now, STATES.daily].forEach((async (state: any) => {
//             state.pathToZip = `${cache}/${state.folder}/${state.filename}.zip`;
//             state.pathToXml = `${cache}/${state.folder}/${state.filename}.xml`;
//             state.pathToJson = `${cache}/${state.folder}/${state.filename}.json`;
//
//             await downloadData(state);
//             setInterval(async () => {
//                 await downloadData(state);
//             }, state.ttl * 1000 * 60);
//         }));
//     });
//
// }

/**
 * @description read the xml files of fuel's price from disk and send it to client.
 *      the 'format' argument ask for the data format that will be send
 * @param state : object  // one of differents State
 * @param res   : object  // js response
 * @param req   : object // js request
 */
const readFiles = (state: any, req: Request, res: Response) => {

    let sended = "";

    switch (req.query.format) {

        case "json":
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            sended = fs.readFileSync(state.pathToJson, {encoding: "ISO-8859-1"});
            res.json(sended);
            break;

        case "xml":
            res.setHeader("Content-Type", "application/xml; charset=utf-8");
            sended = fs.readFileSync(state.pathToXml, {encoding: "ISO-8859-1"});
            res.end(sended);

            break;

        case "zip":
            let filename = state.filename;
            if (state.searchedYear !== undefined) {
                filename = state.searchedYear;
            }
            return res.download(state.pathToZip, filename + ".zip");
            break;
        default:
            sended = "Unknown format (json | xml)";
            res.end(sended);
            break;
    }

};

export function daily(req: Request, res: Response) {
    readFiles(STATES.daily, req, res);
}

export function yearly(req: Request, res: Response) {

    if (req.params.year === undefined) {
        res.json({
            method: "GET",
            params: {
                year: "the year you want data from",
            },
            title: "Incorrect usage",
        });
    }

    const y = Number.parseInt(req.params.year, 10);
    const state = {
        ...STATES.yearly,
        searchedYear: y,
    };
    if (STATES.yearly.years.includes(y)) {
        state.folder += `/${y}`;
        // @ts-ignore
        state.pathToXml = `${cache}/${state.folder}/${state.filename}.xml`;
        // @ts-ignore
        state.pathToJson = `${cache}/${state.folder}/${state.filename}.json`;
        // @ts-ignore
        state.pathToZip = `${cache}/${state.folder}/${state.filename}.zip`;
        readFiles(state, req, res);
    }

}

export function now(req: Request, res: Response) {
    readFiles(STATES.now, req, res);
}
