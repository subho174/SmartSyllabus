import mongoose, { CallbackError, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserDocument } from "../types/user";

const userSchema: Schema<UserDocument> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email"],
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password!, 10);

  next();
});

userSchema.index({ email: 1, username: 1 });

const UserModel =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
