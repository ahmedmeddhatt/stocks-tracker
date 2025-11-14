"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const db_1 = require("./utils/db");
const snapshotCron_1 = require("./cron/snapshotCron");
const PORT = Number(config_1.default.port || 4000);
(0, db_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    // start scheduled jobs
    (0, snapshotCron_1.startSnapshotCron)();
})
    .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});
