"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
async function connectDB(uri) {
    const mongoUri = uri ?? config_1.default.mongoUri;
    mongoose_1.default.set("strictQuery", true);
    await mongoose_1.default.connect(mongoUri);
    console.log("MongoDB connected to", mongoUri);
}
