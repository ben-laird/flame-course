import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasProvider } from "../input";
import { FragUtil } from "../input";
import { Fragment } from ".";

export const modelProvider = new CanvasProvider(
  ...FragUtil.apply(
    [Fragment.course, Fragment.module, Fragment.moduleItem],
    ([courseFrag, moduleFrag, moduleItemFrag]) => {
      const [courseGQL, courseVal] = courseFrag;
      const [moduleGQL, moduleVal] = moduleFrag;
      const [moduleItemGQL, moduleItemVal] = moduleItemFrag;

      return [
        (variables: { id: number }) => [
          gql`
            ${courseGQL}
            ${moduleGQL}
            ${moduleItemGQL}
            query modelQ($id: ID!) {
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
        }),
      ] as const;
    }
  )
);
