import { z } from "zod";

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
