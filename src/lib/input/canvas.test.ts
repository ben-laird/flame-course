import test from "ava";
import { gql } from "graphql-request";
import { z } from "zod";
import CanvasProvider from "./canvas";

test("Creating a CanvasProvider instance without options", (t) => {
  t.notThrows(() => new CanvasProvider(() => ["memes"], z.string()));
});

test("Creating a CanvasProvider instance with options", (t) => {
  t.notThrows(
    () =>
      new CanvasProvider(() => ["memes"], z.string(), {
        endpoint: "https://google.com",
        token: "superMemes",
      })
  );
});

test("Returning correct data from CanvasProvider endpoint without arguments", async (t) => {
  const idsProvider = new CanvasProvider(
    () => [
      gql`
        query CanvasProviderTestNoArgumentQuery {
          courses: allCourses {
            id: _id
          }
        }
      `,
    ],
    z.object({
      courses: z
        .object({
          id: z.string().transform((argument) => parseInt(argument)),
        })
        .array()
        .nullable(),
    })
  );

  const result = await idsProvider.call(null);

  // console.log(result);
  t.assert(result);
});

test("Returning correct data from CanvasProvider endpoint with arguments", async (t) => {
  const idsProvider = new CanvasProvider(
    (variables: { id: number }) => [
      gql`
        query CanvasProviderTestWithArgumentQuery($id: ID!) {
          course(id: $id) {
            id: _id
            name
          }
        }
      `,
      variables,
    ],
    z.object({
      course: z
        .object({
          id: z.string().transform((argument) => parseInt(argument)),
          name: z.string().nullable(),
        })
        .nullable(),
    })
  );

  const result = await idsProvider.call({ id: 55055 });

  // console.log(result);
  t.assert(result);
});
