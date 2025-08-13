import mongoose from "mongoose";

export interface ICourse {
  _id?: string;
  title: string;
  createdBy?: mongoose.Types.ObjectId | string;
}

export type CourseDocument = ICourse & Document;
