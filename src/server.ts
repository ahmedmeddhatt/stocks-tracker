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


  /*

backend/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── controllers/
│   │   ├── positionsController.ts
│   │   ├── transactionsController.ts
│   │   ├── authController.ts
│   │   └── analyticsController.ts
│   ├── cron/
│   │   ├── snapshotCron.ts
│   ├── middleware/
│   │   ├── auth.ts
│   ├── models/
│   │   └── DailySnapshot.ts
│   │   ├── Position.ts
│   │   ├── Transaction.ts
│   │   ├── User.ts
│   ├── routes/
│   │   └── analytics.ts
│   │   └── auth.ts
│   │   ├── positions.ts
│   │   ├── transactions.ts
│   ├── services/
│   │   ├── positionService.ts
│   │   └── snapshotService.ts
│   ├── utils/
│   │   └── db.ts
│   │   └── logger.ts
│   │   └── validators.ts
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json
└── .env
└── .gitignore
└── README.md
└── types.d.ts


  */