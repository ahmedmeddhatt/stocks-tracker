"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "change_me_to_strong_secret";
const JWT_EXPIRES = "7d";
async function register(req, res) {
    const { email, password, name } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "email and password required" });
    try {
        const existing = await User_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ error: "Email already used" });
        const user = await User_1.User.createWithPassword(email, password, name);
        const token = jsonwebtoken_1.default.sign({ sub: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });
        res.status(201).json({
            token,
            user: { id: user._id, email: user.email, name: user.name },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "email and password required" });
    try {
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const ok = await user.comparePassword(password);
        if (!ok)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ sub: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES,
        });
        res.json({
            token,
            user: { id: user._id, email: user.email, name: user.name },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function me(req, res) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Not authenticated" });
    res.json({ id: user._id, email: user.email, name: user.name });
}
