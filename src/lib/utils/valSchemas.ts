import { z } from "zod";
import { subjectCodes } from "./subjects";

export const courseVal = z.object({
  _id: z.string(),
  name: z
    .string()
    .regex(
      /(?:\w{4}\d{3}L?: .+ \(\d{3}\))|(?:\w+)/,
      "Name didn't match regex!"
    ),
  courseCode: z
    .string()
    .regex(
      /(?:\w{4}\d{3}L?_\d{3}_\d{4}\d{2})|(?:[\w ]+)/,
      "Course code didn't match regex!"
    )
    .nullable(),
});

export const subjectCodesVal = z.enum(subjectCodes);

export type SubjectCode = z.infer<typeof subjectCodesVal>;
