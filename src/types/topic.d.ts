export interface ITopic {
  _id?: string;
  courseId: mongoose.Types.ObjectId | string;
  title: string;
  status: "Not started" | "In progress" | "Completed";
}

export type TopicDocument = ITopic & Document;
