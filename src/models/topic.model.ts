import { model, Model, models, Schema } from "mongoose";
import { TopicDocument } from "../types/topic";

const topicSchema: Schema<TopicDocument> = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  title: {
    type: String,
    minlength: 3,
    match: /^[a-zA-Z0-9\s]+$/,
    trim: true,
    required: [true, "Topic title is required"],
  },
  status: {
    type: String,
    enum: ["Not started", "In progress", "Completed"],
    default: "Not started",
  },
});

const Topic =
  (models.Topic as Model<TopicDocument>) ||
  model<TopicDocument>("Topic", topicSchema);

export default Topic;
