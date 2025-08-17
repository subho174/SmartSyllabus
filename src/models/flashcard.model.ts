import { model, Model, models, Schema } from "mongoose";
import { FlashcardDocument } from "../types/flashcard";

const flashcardSchema: Schema<FlashcardDocument> = new Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
  },
  question: {
    type: String,
    trim: true,
    required: [true, "Key point is required"],
  },
  answer: {
    type: String,
    trim: true,
    required: [true, "Takeaway point is required"],
  },
});

const FlashCard =
  (models.FlashCard as Model<FlashcardDocument>) ||
  model<FlashcardDocument>("FlashCard", flashcardSchema);

export default FlashCard;
