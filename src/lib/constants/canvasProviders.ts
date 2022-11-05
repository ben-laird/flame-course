import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasProvider } from "../input";

export const modelProvider = new CanvasProvider(
  (variables: { id: number }) => [
    gql`
      query modelQ($id: ID!) {
        Model: legacyNode(_id: $id, type: User) {
          ... on User {
            enrollments {
              enrollmentId: _id
              course {
                courseId: _id
                name
                courseCode
                modulesConnection {
                  nodes {
                    nodeId: _id
                    name
                    position
                    items: moduleItems {
                      itemId: _id
                      itemUrl: url
                      content {
                        type: __typename
                        ... on SubHeader {
                          title
                        }
                        ... on Page {
                          id: _id
                          title
                          createdAt
                          updatedAt
                        }
                        ... on Assignment {
                          id: _id
                          name
                          description
                          htmlUrl
                          pointsPossible
                          dueAt
                          lockAt
                          state
                          allowedAttempts
                          submissionsConnection {
                            nodes {
                              id: _id
                              rubricAssessmentsConnection {
                                nodes {
                                  assessmentRatings {
                                    _id
                                    criterion {
                                      _id
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        ... on File {
                          id: _id
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables,
  ],
  z.object({
    Model: z.object({
      enrollments: z
        .object({
          enrollmentId: z.number(),
          course: z.object({}),
        })
        .array(),
    }),
  })
);
