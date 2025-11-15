📊 Stock Portfolio Tracker – Backend (Node.js + TypeScript)

A fully-featured backend system for managing stock positions, transactions, analytics, and daily performance snapshots.

This backend helps users track:

- Stock positions
- Historical performance over time
- Investment metrics (avg buy price, P/L, % gain/loss)
- Daily portfolio snapshots
- Company-level analytics
- Transaction-based recalculation
- Authentication + protected routes

---

## 🚀 Features

### ✅ Authentication
- User registration
- User login
- JWT-based authorization

### ✅ Positions
- Add / update / delete stock positions
- Auto-recalculate from transactions
- Real-time metrics updates

### ✅ Transactions
- Add buy/sell transactions
- Automatic position recalculation

### ✅ Analytics
- Portfolio summary
- Per-company analytics
- 90-day snapshot history

### ✅ Daily Snapshots
- Cron job (23:59 UTC)
- Stores daily totals
- Powers charts & trend analysis

---

## 📁 Project Structure

```bash
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
│   │   └── snapshotCron.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── models/
│   │   ├── DailySnapshot.ts
│   │   ├── Position.ts
│   │   ├── Transaction.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── analytics.ts
│   │   ├── auth.ts
│   │   ├── positions.ts
│   │   └── transactions.ts
│   ├── services/
│   │   ├── positionService.ts
│   │   └── snapshotService.ts
│   ├── utils/
│   │   ├── db.ts
│   │   ├── logger.ts
│   │   └── validators.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── types.d.ts

⚙️ Installation
git clone <repo>
cd backend
npm install


Add environment variables:

.env

PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=yourSecretKey


Run the server:

npm run dev

🔐 Authentication Flow
1. Register

POST /api/auth/register

2. Login

POST /api/auth/login

→ Returns a JWT token

3. Use Token

Add to all requests:

Authorization: Bearer <token>

🔥 API Endpoints (With Examples)
🧑‍💼 AUTH
POST /api/auth/register

Body

{
  "name": "Ahmed",
  "email": "ahmed@test.com",
  "password": "123456"
}

POST /api/auth/login

Body

{
  "email": "ahmed@test.com",
  "password": "123456"
}


Returns

{
  "token": "jwt-token-here"
}

📦 POSITIONS
GET /api/positions

Returns all user positions.

POST /api/positions

Body

{
  "companyName": "AAPL",
  "stockPrice": 150,
  "quantity": 10
}

PUT /api/positions/:id

Body

{
  "quantity": 20,
  "stockPrice": 160
}

DELETE /api/positions/:id
💸 TRANSACTIONS
GET /api/transactions?positionId=XYZ
POST /api/transactions

Body

{
  "positionId": "65dfc23...",
  "quantity": 5,
  "price": 160,
  "tax": 2
}


→ Automatically invokes:

recomputePosition(positionId)

DELETE /api/transactions/:id

→ Also recalculates the affected position.

📈 ANALYTICS
GET /api/analytics/summary

Returns:

totalInvestment
totalCurrentValue
totalUnrealizedPnL
unrealizedPct

GET /api/analytics/company/:companyName
GET /api/analytics/snapshots

Returns last 90 snapshots.

POST /api/analytics/snapshot?date=2025-01-10

Force-create a snapshot for a specific day.

🕑 Daily Snapshot Cron Job

File: src/cron/snapshotCron.ts

Runs every day at 23:59 UTC

What it does:

Fetch all users

For each user:

Fetches all positions

Calculates totals

Creates DailySnapshot record

This powers:

Trend charts

Daily P/L history

Long-term analytics

🔄 Full User Flow (A → Z)
1️⃣ User registers

Creates account

2️⃣ User logs in

Receives JWT token

3️⃣ User creates positions

Example:

Buy 10 shares AAPL at $150

System stores:

investment

investmentWithTax

avg purchase price

etc.

4️⃣ User adds transactions

Example:

Buy 5 more shares

Sell 3 shares

System automatically recalculates:

totalQuantity

avgPurchasePrice

totalInvestment

fees

unrealizedPnL

5️⃣ User checks analytics

Portfolio performance

Company-specific metrics

Snapshot history

6️⃣ Cron job runs nightly

Stores daily values

Used for charts & historical tracking

7️⃣ User sees 3-month historical trend

From stored snapshots.

🧪 Postman Testing Guide
Import these collections:
1. Auth

Register

Login

Store token → collection variable

2. Positions

Get all

Create

Update

Delete

3. Transactions

Get all

Create

Delete

4. Analytics

Summary

Company analytics

Snapshot list

Force snapshot

🛠 Technologies Used

Node.js

TypeScript

Express

MongoDB + Mongoose

JWT Authentication

node-cron

Winston logger

📌 Future Enhancements

Real-time stock price integration

WebSocket live portfolio updates

Monthly summary aggregation

AI-powered risk analysis