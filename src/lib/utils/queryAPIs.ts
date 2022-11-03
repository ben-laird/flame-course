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
            enrollments {
              _id
              course {
                _id
                name
                courseCode
                modulesConnection {
                  nodes {
                    _id
                    name
                    position
                    moduleItems {
                      _id
                      content {
                        __typename
                        ... on Page {
                          id
                          _id
                          title
                          createdAt
                          updatedAt
                        }
                        ... on SubHeader {
                          title
                        }
                        ... on Assignment {
                          id
                          name
                          _id
                          description
                          allowedAttempts
                          dueAt
                          lockAt
                          pointsPossible
                          htmlUrl
                          state
                        }
                        ... on File {
                          id
                          _id
                          contentType
                          fileUrl: url
                        }
                        ... on ExternalTool {
                          createdAt
                          description
                          _id
                          name
                          toolUrl: url
                        }
                        ... on Discussion {
                          id
                          _id
                          title
                        }
                        ... on Quiz {
                          id
                          _id
                        }
                        ... on ExternalUrl {
                          createdAt
                          title
                          extUrl: url
                          _id
                        }
                        ... on ModuleExternalTool {
                          createdAt
                          updatedAt
                          _id
                          modUrl: url
                        }
                      }
                      moduleUrl: url
                    }
                  }
                }
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

export const idsAPI = new CanvasAPI((vars: { id: number }) => ({
  req: {
    query: gql`
      query CourseIdsQ($id: ID!) {
        legacyNode(_id: $id, type: User) {
          ... on User {
            enrollments {
              course {
                _id
              }
            }
          }
        }
      }
    `,
    variables: vars,
  },
  val: z.object({
    user: z.object({
      enrollments: z.object({
        course: z
          .object({
            _id: z.number(),
          })
          .array(),
      }),
    }),
  }),
}));
