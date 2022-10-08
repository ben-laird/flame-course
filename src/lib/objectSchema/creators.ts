import { gql } from "graphql-request";
import { z } from "zod";
import CanvasAPI from "../input/canvasApi";
import Course, { CourseParams } from "./course";

// TODO Switch courseCreator from CanvasAPI to CanvasAPI

export const courseCreator = async () => {
  const connection = (await new CanvasAPI({
    req: {
      query: gql`
        query CourseCreator {
          allCourses {
            _id
            name
            courseCode
          }
        }
      `,
    },
    val: z.object({
      allCourses: z.array(
        z.object({
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
        })
      ),
    }),
  }).call()) as { allCourses: Array<CourseParams> };

  return connection.allCourses.map((courseData) => new Course(courseData));
};

// TODO Add creators
