import app from "./app";
import config from "./config";
import { connectDB } from "./utils/db";
import { startSnapshotCron } from "./cron/snapshotCron";

const PORT = Number(config.port || 4000);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    // start scheduled jobs
    startSnapshotCron();
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
