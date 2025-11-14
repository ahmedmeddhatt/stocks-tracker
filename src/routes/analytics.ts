import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// Aggregated analytics (total portfolio summary)
router.get("/summary", analyticsController.getSummary);

// Analytics per company (aggregated view per company)
router.get("/company/:companyName", analyticsController.getCompanyAnalytics);

// Daily snapshots and filters
router.get("/snapshots", analyticsController.getSnapshots);
router.post("/snapshot", analyticsController.createSnapshot);

export default router;
