// Needed Resources
import { Router } from "express";
const router = new Router();
import { buildByClassificationId } from "../controllers/invController";

// Route to build inventory by classification view
router.get("/type/:classificationId", buildByClassificationId);

export default router;
