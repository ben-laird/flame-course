import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasAPI } from "../input";

export const singleCourseAPI = new CanvasAPI((vars: { id: number }) => ({
  req: {
    query: gql`
      query singleCourseQ($id: ID!) {
        course(id: $id) {
          _id
          name
          courseCode
        }
      }
    `,
    variables: vars,
  },
  val: z.object({
    course: z.object({
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
    }),
  }),
}));

export const courseAPI = new CanvasAPI(() => ({
  req: {
    query: gql`
      query courseQ {
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
}));

export const modelAPI = new CanvasAPI((vars: { id: number }) => ({
  req: {
    query: gql`
      query modelQ($id: ID!) {
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
    variables: vars,
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
}));
