import fetch from "cross-fetch";
import {Request, Response, Router} from "express"; // to transform xml to json
import {xml2json} from "xml-js";
import {Method, URI, WrongCallException} from "../errors/functional/WrongCallException";

export const router = Router();

interface API {
    ip: URI;
    xmlToJson: URI;
    downloadOnNas: URI;
}

export const api: API = {
    ip: {
        description: "Get the ip of the machine",
        method: Method.GET,
        url: "/ip",
    },

    xmlToJson: {
        description: "Get the ip of the machine",
        method: Method.GET,
        parameters: [{
            description: "the url of the xml feed",
            name: "url",
            type: String,
        }],
        url: "/xmlToJson",
    },

    downloadOnNas: {
        description: "Get the ip of the machine",
        method: Method.PUT,
        parameters: [
            {
                description: "the url of the xml feed",
                name: "type",
                type: String,
                possibleValues: ["magnet", "torrent_file_path"],
            },
            {
                description: "the path of the torrent on vps",
                name: "file_path",
                type: String,
            },
            {
                description: "the magnet of the torrent",
                name: "magnet",
                type: String,
            },
        ],
        url: "/nas",
    },
};

router.get(api.xmlToJson.url, (req: Request, res: Response) => {
    xmlToJson(req, res);
});

router.get(api.ip.url, (req: Request, res: Response) => {
    getIp().then((ip) => {
        res.json(ip);
    });
});

router.put(api.downloadOnNas.url, (req, res) => {
    console.log("Keys", Object.keys(req.query));
    res.json({success: true});
});

function xmlToJson(req: Request, res: Response) {
    if (req.query.url === undefined) {

        res.json(new WrongCallException(api.xmlToJson));
    } else {
        res.json(xml2json(req.query.url));
    }

}

async function getIp() {
    return new Promise<string>((resolve) => {
        fetch("https://api.ipify.org/?format=json")
            .then((t) => t.json())
            .then((json) => resolve(json.id));
    });
}
