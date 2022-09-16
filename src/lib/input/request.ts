import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

type ReqSchema = [req: string, val: z.Schema];

export class CanvasConnection {
  private canvasEndpoint =
    "https://libertyuniversity.instructure.com/api/graphql";

  private testQuery: ReqSchema = [
    gql`
      query MyQuery {
        allCourses {
          _id
          courseCode
          name
        }
      }
    `,
    z.object({
      allCourses: z.array(
        z.object({
          _id: z.string(),
          courseCode: z.string(),
          name: z.string(),
        })
      ),
    }),
  ];

  private query: ReqSchema;

  constructor(reqSchema?: ReqSchema) {
    this.query = reqSchema ? reqSchema : this.testQuery;
  }

  public call = async () => {
    const client = new GraphQLClient(this.canvasEndpoint).setHeader(
      "authorization",
      `Bearer ${process.env.CANVAS_AUTH_TOKEN}`
    );
    const [req, val] = this.query;

    const response = await client.request(req);
    const parsedResponse = val.parse(response);
    return parsedResponse;
  };
}
