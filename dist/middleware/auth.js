"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "change_me_to_strong_secret";
async function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth)
        return res.status(401).json({ error: "Missing authorization header" });
    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token)
        return res.status(401).json({ error: "Invalid authorization header" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.User.findById(payload.sub);
        if (!user)
            return res.status(401).json({ error: "User not found" });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
