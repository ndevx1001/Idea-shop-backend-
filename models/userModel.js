import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
    canReset: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    full_name: { type: String },
    gmail: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    googleId: { type: String }
})

export default mongoose.model("User", userSchema)