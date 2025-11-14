import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import positionsRouter from "./routes/positions";
import transactionsRouter from "./routes/transactions";
import analyticsRouter from "./routes/analytics";
import authRouter from "./routes/auth";
import logger from "./utils/logger";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) =>
  res.json({ ok: true, message: "Stock tracker backend" })
);

// simple error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
