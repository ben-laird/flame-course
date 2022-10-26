import test from "ava";
import { gql } from "graphql-request";
import { z } from "zod";
import CanvasAPI, { ReqFunc } from "./canvasApi";

// TODO Add extra coverage tests

interface ConTestParams {
  query: ReqFunc<z.Schema>;
  errorMessage: string;
  display?: boolean;
}

const connectionTest = test.macro(async (t, params: ConTestParams) => {
  const { query, errorMessage, display } = params;
  const response = await new CanvasAPI(query).call(undefined);
  if (display !== undefined && display) console.log(response);
  t.assert(response, errorMessage);
});

test("Connection is constructed correctly", (t) => {
  const connector = new CanvasAPI(
    () => ({
      req: {
        query: gql`
          query MemesQ {
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
    }),
    { token: "memes", endpoint: "bigmemes" }
  );

  t.assert(connector, "Canvas connector was not constructed properly!");
});

test("Canvas returns data", connectionTest, {
  query: () => ({
    req: {
      query: gql`
        query ReturnDataQ {
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
  }),
  errorMessage: "Canvas endpoint did not return data properly!",
  display: true,
});

test("Canvas returns schema types", connectionTest, {
  query: () => ({
    req: {
      query: gql`
        query SchemaFragQ {
          __schema {
            types {
              name
            }
          }
        }
      `,
    },
    val: z.object({
      __schema: z.object({
        types: z.array(
          z.object({
            name: z.string(),
          })
        ),
      }),
    }),
  }),
  errorMessage: "Canvas endpoint did not return schema types correctly!",
});

test("Canvas returns fragment of docs", connectionTest, {
  query: () => ({
    req: {
      query: gql`
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
    },
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
  }),
  errorMessage: "Canvas endpoint did not return documentation correctly!",
});
