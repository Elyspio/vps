import {json, urlencoded} from "body-parser";

import * as express from "express";
import {router as fuelRouter} from "./controllers/fuel.controller";
import {router as toolRouter} from "./controllers/tool.controller";
import {FuelManager} from "./model/fuel/fuelManager";

const app = express();

async function main() {
    app.set("port", process.env.PORT || 3000);

    app.use("/fuel", fuelRouter);
    app.use("/tool", toolRouter);

    app.use(json());
    app.use(urlencoded({extended: true}));

    // const manualStorage = new ManualStorage();
    // manualStorage.put({
    //     category: ManualCategories.SOFTWARE,
    //     text: ["Je", "suis", "un", "text"],
    //     title: "Je suis le titre!!",
    // });
    //
    //
    // console.log(manualStorage.get(ManualCategories.SOFTWARE));
    // console.log(manualStorage.get(ManualCategories.ALL));

    const c = await FuelManager.fetchInstantFuels();
    // const b = await FuelManager.fetchYearlyFuels(2019);

}

main().then(() => {
    app.listen(3000, (args) => {
        console.log("OK");
    });
});
