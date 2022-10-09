import { gql } from "graphql-request";
import { z } from "zod";
import CanvasAPI from "./input/canvasApi";
import Course, { CourseParams } from "./objectSchema/course";

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

export const superCreator = async (userId: number) => {
  const connection = await new CanvasAPI({
    req: {
      query: gql`
        query superCreator($id: ID!) {
          legacyNode(_id: $id, type: User) {
            ... on User {
              __typename
              enrollments {
                _id
                course {
                  _id
                  name
                  courseCode
                }
                section {
                  _id
                  name
                }
                state
              }
            }
          }
        }
      `,
      variables: { id: userId },
    },
    val: z.object({
      user: z.object({
        __typename: z.string(),
        enrollments: z
          .object({
            _id: z.string(),
            course: z.object({
              _id: z.string(),
              name: z.string(),
              courseCode: z.string(),
            }),
          })
          .array(),
        section: z.object({
          _id: z.string(),
          name: z.string(),
        }),
        state: z.string(),
      }),
    }),
  });

  return connection.call();
};
