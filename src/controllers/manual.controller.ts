import {Router} from "express";

export const router = Router();

router.get("/pages");
router.get(/pages\/[1-9]+[0-9]*/);

router.put("/pages");
router.post(/pages\/[1-9]+[0-9]*/);
