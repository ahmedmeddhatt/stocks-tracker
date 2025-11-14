"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSnapshotCron = startSnapshotCron;
const node_cron_1 = __importDefault(require("node-cron"));
const snapshotService_1 = require("../services/snapshotService");
// Runs every day at 23:59 UTC
function startSnapshotCron() {
    node_cron_1.default.schedule("59 23 * * *", async () => {
        try {
            console.log("Running daily snapshot cron");
            await (0, snapshotService_1.createDailySnapshot)(new Date());
        }
        catch (err) {
            console.error("Snapshot cron error", err);
        }
    }, { timezone: "UTC" });
}
