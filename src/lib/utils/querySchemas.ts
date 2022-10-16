import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasQuerySchema } from "../input";
import { subjectCodes } from "./subjects";

// const schemaCreator = <K extends z.Schema, T>(schema: Omit<CanvasQuerySchema<K>,"">) => (args: T): CanvasQuerySchema<K> =>

export const allCoursesSchema = () => {
  const template = {
    req: {
      query: gql`
        query v {
          allCourses {
            _id
            name
            courseCode
          }
        }
      `,
    },
    val: z.object({
      allCourses: z
        .object({
          _id: z.string(),
          name: z
            .string()
            .regex(
              /(?:\w{3,4}\d{3}L?: .+ \(\d{3}\))|(?:\w+)/,
              "Name didn't match regex!"
            ),
          courseCode: z
            .string()
            .regex(
              /(?:\w{3,4}\d{3}L?_\d{3}_\d{4}\d{2})|(?:[\w ]+)/,
              "Course code didn't match regex!"
            )
            .nullable(),
        })
        .array(),
    }),
  };

  return template as CanvasQuerySchema<typeof template["val"]>;
};

export const modelQuerySchema = (userId: number) => {
  const template = {
    req: {
      query: gql`
        query s($id: ID!) {
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
  };

  return template as CanvasQuerySchema<typeof template["val"]>;
};

export const subjectCodesVal = z.enum(subjectCodes);

export type SubjectCode = z.infer<typeof subjectCodesVal>;
