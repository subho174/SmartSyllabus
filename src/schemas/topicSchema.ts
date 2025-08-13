import z from "zod";

export const topicSchema = z.object({
  courseId: z.string().length(24, "Course id must be 24 characters long"),
  title: z
    .string()
    .trim()
    .min(3, "Topic title must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Topic title can only contain letters, numbers, and spaces"
    ),
});

export type TopicSchemaType = z.infer<typeof topicSchema>;
