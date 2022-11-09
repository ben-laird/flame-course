import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasProvider, FragmentUtil } from "../input";
import { FragmentConst } from ".";

/**
 * A pre-fabricated provider for creating a Model.
 */
export const modelProvider = new CanvasProvider(
  ...FragmentUtil.apply(
    [FragmentConst.course, FragmentConst.module, FragmentConst.moduleItem],
    ([
      [courseGQL, courseVal],
      [moduleGQL, moduleVal],
      [moduleItemGQL, moduleItemVal],
    ]) =>
      FragmentUtil.createQuery(
        (variables: { id: number }) => [
          gql`
            ${courseGQL}
            ${moduleGQL}
            ${moduleItemGQL}
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
                            items: moduleItemVal.array().nullable(),
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
