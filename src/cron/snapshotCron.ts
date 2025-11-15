import cron from "node-cron";
import { createDailySnapshot } from "../services/snapshotService";
import { User } from "../models/User";

export function startSnapshotCron() {
  cron.schedule(
    "59 23 * * *",
    async () => {
      try {
        console.log("Running daily snapshot cron");

        const users = await User.find({}, "_id");
        for (const u of users) {
          await createDailySnapshot(u._id.toString(), new Date());
        }

        console.log("Daily snapshots created for all users.");
      } catch (err) {
        console.error("Snapshot cron error", err);
      }
    },
    { timezone: "UTC" }
  );
}

export default startSnapshotCron;