import { GraphQLClient } from "graphql-request";
import { z } from "zod";

export interface CanvasQuerySchema<ZValidator extends z.Schema> {
  req: string;
  val: ZValidator;
}

export class CanvasConnection<ZValidator extends z.Schema> {
  private canvasEndpoint =
    "https://libertyuniversity.instructure.com/api/graphql";

  private token = process.env.CANVAS_AUTH_TOKEN;

  private query;

  constructor(query: CanvasQuerySchema<ZValidator>, token?: string) {
    this.query = query;
    if (token !== undefined) this.token = token;
  }

  public call = async () => {
    const client = new GraphQLClient(this.canvasEndpoint).setHeader(
      "authorization",
      `Bearer ${this.token}`
    );
    const { req, val } = this.query;

    const response = await client.request(req);
    const parsedResponse = val.parse(response);
    return parsedResponse as z.infer<typeof val>;
  };
}
