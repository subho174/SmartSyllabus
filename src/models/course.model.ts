import { model, Model, models, Schema } from "mongoose";
import { ICourse } from "../types/course";

const courseSchema: Schema<ICourse> = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 3,
    match: /^[a-zA-Z0-9\s]+$/,
    required: [true, "course title is required"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Course =
  (models.Course as Model<ICourse>) || model<ICourse>("Course", courseSchema);

export default Course;
