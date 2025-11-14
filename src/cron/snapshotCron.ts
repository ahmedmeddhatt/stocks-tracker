import cron from "node-cron";
import { createDailySnapshot } from "../services/snapshotService";

// Runs every day at 23:59 UTC
export function startSnapshotCron() {
  cron.schedule(
    "59 23 * * *",
    async () => {
      try {
        console.log("Running daily snapshot cron");
        await createDailySnapshot(new Date());
      } catch (err) {
        console.error("Snapshot cron error", err);
      }
    },
    { timezone: "UTC" }
  );
}
