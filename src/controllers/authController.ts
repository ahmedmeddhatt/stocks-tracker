import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import config from "../config";

const JWT_SECRET = process.env.JWT_SECRET || "change_me_to_strong_secret";
const JWT_EXPIRES = "7d";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already used" });
    const user = await (User as any).createWithPassword(email, password, name);
    const token = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  try {
    const user: any = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ sub: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ id: user._id, email: user.email, name: user.name });
}
