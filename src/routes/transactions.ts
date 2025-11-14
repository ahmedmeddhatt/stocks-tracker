import { Router } from "express";
import * as transactionsController from "../controllers/transactionsController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", transactionsController.getTransactions);
router.get("/:id", transactionsController.getTransactionById);
router.post("/", transactionsController.createTransaction);
router.delete("/:id", transactionsController.deleteTransaction);

export default router;
