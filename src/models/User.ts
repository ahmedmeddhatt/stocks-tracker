import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


const SALT_ROUNDS = 10;


const UserSchema = new Schema({
email: { type: String, required: true, unique: true, lowercase: true },
passwordHash: { type: String, required: true },
name: { type: String },
}, { timestamps: true });


UserSchema.methods.comparePassword = function(password: string) {
return bcrypt.compare(password, this.passwordHash);
};


UserSchema.statics.createWithPassword = async function(email: string, password: string, name?: string) {
const hash = await bcrypt.hash(password, SALT_ROUNDS);
return this.create({ email, passwordHash: hash, name });
};


export const User = model('User', UserSchema);