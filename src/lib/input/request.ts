import { GraphQLClient } from "graphql-request";
import { z } from "zod";

export interface CanvasQuerySchema<ZVal extends z.Schema> {
  req: string;
  val: ZVal;
}

export class CanvasConnection<
  ZVal extends z.Schema,
  CallShape = z.infer<ZVal>
> {
  private canvasEndpoint =
    "https://libertyuniversity.instructure.com/api/graphql";

  private token = process.env.CANVAS_AUTH_TOKEN;

  private query;

  constructor(query: CanvasQuerySchema<ZVal>, token?: string) {
    this.query = query;
    if (token !== undefined) this.token = token;
  }

  public call = async (): Promise<CallShape> => {
    const client = new GraphQLClient(this.canvasEndpoint).setHeader(
      "authorization",
      `Bearer ${this.token}`
    );
    const { req, val } = this.query;

    const response = await client.request<CallShape>(req);
    return val.parse(response) as CallShape;
  };
}
