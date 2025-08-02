import { Document } from "mongoose";

export interface IUser {
  _id: string,
  username: string;
  email: string;
  password?: string; // Optional for security reasons
}

export type UserDocument = IUser & Document;