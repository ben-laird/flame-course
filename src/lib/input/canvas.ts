import { GraphQLClient } from "graphql-request";
import { z } from "zod";
import Connection from "./connection";

type ConnectParams = [
  query: string,
  variables?: Record<string, string | number>
];

export default class Canvas<
  InputParams,
  ZVal extends z.Schema,
  OutShape extends z.infer<ZVal> = z.infer<ZVal>
> extends Connection<InputParams, ConnectParams, OutShape, ZVal> {
  private endpoint = "canvas.liberty.edu";

  private token = process.env.CANVAS_AUTH_TOKEN;

  protected connect = async (...params: ConnectParams) => {
    const [query, variables] = params;

    const client = new GraphQLClient(this.endpoint).setHeader(
      "authorization",
      `Bearer ${this.token}`
    );
    return client.request<OutShape>(query, variables);
  };

  constructor(
    reqFactory: (vars: InputParams) => ConnectParams,
    validator: ZVal,
    options?: { endpoint?: string; token?: string }
  ) {
    super(reqFactory, validator);

    if (options !== undefined) {
      const { endpoint, token } = options;
      if (token !== undefined) this.token = token;
      if (endpoint !== undefined) this.endpoint = endpoint;
    }
  }
}
