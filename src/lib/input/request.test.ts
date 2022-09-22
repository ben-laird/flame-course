import test from "ava";
import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasConnection, CanvasQuerySchema } from "./request";

interface ConTestParams {
  schema: CanvasQuerySchema<z.Schema>;
  errorMessage: string;
  display?: boolean;
}

const connectionTest = test.macro(async (t, params: ConTestParams) => {
  const { schema, errorMessage, display } = params;
  const response = await new CanvasConnection(schema).call();
  if (display !== undefined && display) console.log(response);
  t.assert(response, errorMessage);
});

test("Canvas returns data", connectionTest, {
  schema: {
    req: gql`
      query ReturnDataQ {
        allCourses {
          _id
          name
          courseCode
        }
      }
    `,
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
  },
  errorMessage: "Canvas endpoint did not return data properly!",
  display: true,
});

test("Canvas returns schema types", connectionTest, {
  schema: {
    req: gql`
      query SchemaFragQ {
        __schema {
          types {
            name
          }
        }
      }
    `,
    val: z.object({
      __schema: z.object({
        types: z.array(
          z.object({
            name: z.string(),
          })
        ),
      }),
    }),
  },
  errorMessage: "Canvas endpoint did not return schema types correctly!",
});

test("Canvas returns fragment of docs", connectionTest, {
  schema: {
    req: gql`
      query SchemaDocsFragQ {
        __type(name: "__Schema") {
          name
          description
          fields {
            name
            type {
              name
              kind
              description
              ofType {
                name
                kind
                description
              }
            }
          }
        }
      }
    `,
    val: z.object({
      __type: z.object({
        name: z.string(),
        description: z.string().nullable(),
        fields: z.array(
          z.object({
            name: z.string(),
            type: z.object({
              name: z.string().nullable(),
              kind: z.string(),
              description: z.string().nullable(),
              ofType: z
                .object({
                  name: z.string().nullable(),
                  kind: z.string(),
                  description: z.string().nullable(),
                })
                .nullable(),
            }),
          })
        ),
      }),
    }),
  },
  errorMessage: "Canvas endpoint did not return documentation correctly!",
});
