import { Router } from "express";
import { syncData } from "@controllers/syncDataController";

const router: Router = Router();

router.post("/syncData", syncData);

export default router;