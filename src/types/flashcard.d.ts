import mongoose, { Document } from "mongoose";

export interface IFlashcard {
  _id?: string;
  topicId?: mongoose.Types.ObjectId | string;
  question: string;
  answer: string;
}

export type FlashcardDocument = IFlashcard & Document;
