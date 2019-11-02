import {json, urlencoded} from "body-parser";
import {router as fuelRouter} from "./controllers/fuel.controller";
import {router as toolRouter} from "./controllers/tool.controller";
import {ManualCategories} from "./model/manual/manual";
import {ManualStorage} from "./model/storage/ManualStorage";

const express = require("express");

const app = express();

async function main() {
    app.set("port", process.env.PORT || 3000);

    app.use(fuelRouter);
    app.use(toolRouter);

    app.use(json());
    app.use(urlencoded({extended: true}));
    // fuelInit().then(() => {
    //     app.use(fuelRouter);
    // });

// toolController
//     app.get(toolController.URLS.getIp.path, toolController.getIp);
//     app.get(toolController.URLS.xmlToJson.path, toolController.xmlToJson);

    // app.listen(app.get('port'), () => {
    // });

    const manualStorage = new ManualStorage();
    manualStorage.put({
        category: ManualCategories.SOFTWARE,
        text: ["Je", "suis", "un", "text"],
        title: "Je suis le titre!!",
    });


    console.log(manualStorage.get(ManualCategories.SOFTWARE));
    console.log(manualStorage.get(ManualCategories.ALL));


    // console.log(manualStorage.get());

    module.exports = app;

}

main();
