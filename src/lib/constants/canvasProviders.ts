import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasProvider, FragmentUtil } from "../input";
import { FragmentConst as C } from ".";

/**
 * A pre-fabricated provider for creating a Model.
 */
export const modelProvider = new CanvasProvider(
  ...FragmentUtil.apply(
    [
      C.course,
      C.module,
      C.moduleItem,
      C.subHeader,
      C.page,
      C.assignment,
      C.file,
      C.extUrl,
      C.moduleExtTool,
      C.extTool,
      C.discussion,
      C.quiz,
    ],
    ([
      [courseGQL, courseVal],
      [moduleGQL, moduleVal],
      [moduleItemGQL, moduleItemVal],
      [subHeaderGQL, subHeaderVal],
      [pageGQL, pageVal],
      [assignmentGQL, assignmentVal],
      [fileGQL, fileVal],
      [extUrlGQL, extUrlVal],
      [moduleExtToolGQL, moduleExtToolVal],
      [extToolGQL, extToolVal],
      [discussionGQL, discussionVal],
      [quizGQL, quizVal],
    ]) =>
      FragmentUtil.createQuery(
        (variables: { id: number }) => [
          gql`
            ${courseGQL}
            ${moduleGQL}
            ${moduleItemGQL}
            ${subHeaderGQL}
            ${pageGQL}
            ${assignmentGQL}
            ${fileGQL}
            ${extUrlGQL}
            ${moduleExtToolGQL}
            ${extToolGQL}
            ${discussionGQL}
            ${quizGQL}
            query ModelProvider($id: ID!) {
              Model: legacyNode(_id: $id, type: User) {
                ... on User {
                  enrollments {
                    id: _id
                    course {
                      ...CourseFragment
                      modulesConnection {
                        modules: nodes {
                          ...ModuleFragment
                          items: moduleItems {
                            ...ModuleItemFragment
                            content {
                              ...SubHeaderFragment
                              ...PageFragment
                              ...AssignmentFragment
                              ...FileFragment
                              ...ExtUrlFragment
                              ...ModuleExtToolFragment
                              ...ExtToolFragment
                              ...DiscussionFragment
                              ...QuizFragment
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
                id: z.number(),
                course: courseVal
                  .extend({
                    modulesConnection: z
                      .object({
                        modules: moduleVal
                          .extend({
                            items: moduleItemVal
                              .extend({
                                content: z
                                  .union([
                                    subHeaderVal,
                                    pageVal,
                                    assignmentVal,
                                    fileVal,
                                    extUrlVal,
                                    moduleExtToolVal,
                                    extToolVal,
                                    discussionVal,
                                    quizVal,
                                  ])
                                  .nullable(),
                              })
                              .array()
                              .nullable(),
                          })
                          .nullable()
                          .array()
                          .nullable(),
                      })
                      .nullable(),
                  })
                  .nullable(),
              })
              .array(),
          }),
        })
      )
  )
);

/**
 * A pre-fabricated provider for obtaining course identifiers.
 */
export const idsProvider = new CanvasProvider(
  () => [
    gql`
      query IdsProvider {
        courses: allCourses {
          id: _id
        }
      }
    `,
  ],
  z.object({
    courses: z
      .object({
        id: z.number(),
      })
      .array()
      .nullable(),
  })
);
