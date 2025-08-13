import z from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Course title must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      "Course title can only contain letters, numbers, and spaces"
    ),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
