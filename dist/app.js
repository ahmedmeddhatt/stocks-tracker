"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const positions_1 = __importDefault(require("./routes/positions"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const auth_1 = __importDefault(require("./routes/auth"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/positions", positions_1.default);
app.use("/api/transactions", transactions_1.default);
app.use("/api/analytics", analytics_1.default);
app.get("/", (req, res) => res.json({ ok: true, message: "Stock tracker backend" }));
// simple error handler
app.use((err, req, res, next) => {
    logger_1.default.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});
exports.default = app;
