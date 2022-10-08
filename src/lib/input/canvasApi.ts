import { GraphQLClient, Variables } from "graphql-request";
import { z } from "zod";

// TODO Finish implementing ways to inject variables into requests

// TODO Add full documentation

export interface CanvasQuerySchema<ZVal extends z.Schema> {
  req: {
    query: string;
    variables?: Variables;
  };
  val: ZVal;
}

export interface CanvasAPIOptions {
  token?: string;
  endpoint?: string;
}

export type CanvasAPIParams<ZVal extends z.Schema> = [
  query: CanvasQuerySchema<ZVal>,
  options?: CanvasAPIOptions
];

export type ShapeInfer<T extends CanvasAPI<z.Schema>> = T extends CanvasAPI<
  z.Schema,
  infer R
>
  ? R
  : never;

export default class CanvasAPI<
  ZVal extends z.Schema,
  APIShape = z.infer<ZVal>
> {
  private canvasEndpoint =
    "https://libertyuniversity.instructure.com/api/graphql";

  private token = process.env.CANVAS_AUTH_TOKEN;

  private query;

  private cache: APIShape | null = null;

  private invalidateInterval = 5000;

  constructor(...params: CanvasAPIParams<ZVal>) {
    const [query, options] = params;

    this.query = query;

    if (options !== undefined) {
      const { endpoint, token } = options;
      if (token !== undefined) this.token = token;
      if (endpoint !== undefined) this.canvasEndpoint = endpoint;
    }
  }

  public callEndpoint = async (gqlVariables?: Variables): Promise<APIShape> => {
    const client = new GraphQLClient(this.canvasEndpoint).setHeader(
      "authorization",
      `Bearer ${this.token}`
    );
    const { req, val } = this.query;
    const { query, variables } = req;

    const vars = gqlVariables !== undefined ? gqlVariables : variables;

    const response = await client.request<APIShape>(query, vars);

    this.cache = response;
    setTimeout(() => (this.cache = null), this.invalidateInterval);

    return val.parse(response) as APIShape;
  };

  public call = async (gqlVariables?: Variables): Promise<APIShape> => {
    if (this.cache !== null) return this.cache;
    else return this.callEndpoint(gqlVariables);
  };
}
