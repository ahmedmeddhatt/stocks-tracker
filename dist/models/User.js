"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
}, { timestamps: true });
UserSchema.methods.comparePassword = function (password) {
    return bcrypt_1.default.compare(password, this.passwordHash);
};
UserSchema.statics.createWithPassword = async function (email, password, name) {
    const hash = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    return this.create({ email, passwordHash: hash, name });
};
exports.User = (0, mongoose_1.model)('User', UserSchema);
