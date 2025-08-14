import { model, Model, models, Schema } from "mongoose";
import { SummaryDocument } from "../types/summary";
import { trim } from "zod";

const summarySchema: Schema<SummaryDocument> = new Schema({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
  },
  keyPoints: [
    {
      type: String,
      trim: true,
      required: [true, "Key point is required"],
    },
  ],
  takeAways: [
    {
      type: String,
      trim: true,
      required: [true, "Takeaway point is required"],
    },
  ],
});

const Summary =
  (models.Summary as Model<SummaryDocument>) ||
  model<SummaryDocument>("Summary", summarySchema);

export default Summary;
