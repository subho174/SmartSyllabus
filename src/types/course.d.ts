import mongoose from "mongoose";

export interface ICourse {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  createdBy: mongoose.Types.ObjectId | string;
}
