import fetch from "cross-fetch";
import {Request, Response} from "express"; // to transform xml to json
import {Router} from "express";
import {xml2json} from "xml-js";

const prefix = "/tool";

export const router = Router();

export const URLS = {
    getIp: {path: `${prefix}/ip`, help: "Return Ip of the server"},
    xmlToJson: {path: `${prefix}/xmlToJson`, help: "Transform XML stream to JSON"},
};

router.get(URLS.xmlToJson.path, (req: Request, res: Response) => {
    xmlToJson(req, res);
});

router.get(URLS.getIp.path, (req: Request, res: Response) => {
    getIp(req, res);
});

/**
 *
 * @param req
 * @param res
 */
export function xmlToJson(req: Request, res: Response) {
    if (req.query.url === undefined) {
        res.json({
            method: "GET",
            params: {
                url: "Xml stream url",
            },
            title: "Incorrect usage",
        });
    } else {
        res.json(xml2json(req.query.url));
    }

}

export async function getIp(req: Request, res: Response) {
    const text: ResponseType = await fetch("https://api.ipify.org?format=json").then(((value) => value.json()));
    res.json(text);
}
