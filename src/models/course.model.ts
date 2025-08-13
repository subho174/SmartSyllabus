import { model, Model, models, Schema } from "mongoose";
import { CourseDocument } from "../types/course";

const courseSchema: Schema<CourseDocument> = new Schema({
  title: {
    type: String,
    trim: true,
    minlength: 3,
    match: /^[a-zA-Z0-9\s]+$/,
    required: [true, "Course title is required"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Course =
  (models.Course as Model<CourseDocument>) ||
  model<CourseDocument>("Course", courseSchema);

export default Course;
