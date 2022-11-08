import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasProvider, FragmentUtil } from "../input";
import { FragmentConst } from ".";

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
