import { Router } from "express";
import * as positionsController from "../controllers/positionsController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All routes are protected — require a logged-in user
router.use(requireAuth);

router.get("/", positionsController.getAllPositions);
router.get("/:id", positionsController.getPositionById);
router.post("/", positionsController.createPosition);
router.put("/:id", positionsController.updatePosition);
router.delete("/:id", positionsController.deletePosition);

export default router;
