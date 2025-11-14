import { Router } from "express";
import * as ctrl from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

router.use(requireAuth);

router.get("/me", ctrl.me);

export default router;
