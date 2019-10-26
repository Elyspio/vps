import * as bodyParser from "body-parser";

import express from "express";
import {router as fuelRouter} from "./controllers/fuel.controller";
import {router as toolRouter} from "./controllers/tool.controller";
import {Storage, StorageFiles} from "./model/storage/storage";

const app = express();

async function main() {
    app.set("port", process.env.PORT || 3000);

    app.use(fuelRouter);
    app.use(toolRouter);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // fuelInit().then(() => {
    //     app.use(fuelRouter);
    // });

// toolController
//     app.get(toolController.URLS.getIp.path, toolController.getIp);
//     app.get(toolController.URLS.xmlToJson.path, toolController.xmlToJson);

    // app.listen(app.get('port'), () => {
    // });

    module.exports = app;

}

main();
