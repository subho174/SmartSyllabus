export interface ISummary {
  _id?: string;
  topicId?: mongoose.Types.ObjectId | string;
  keyPoints: string[];
  takeAways: string[];
}

export type SummaryDocument = ISummary & Document;
