import { Router } from "express";
import { botMessage } from "@controllers/botController";

const router: Router = Router();

router.post("/botMessage", botMessage);

export default router;