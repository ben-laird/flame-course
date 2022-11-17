import { GraphQLClient } from "graphql-request";
import { z } from "zod";
import Provider, { ProviderInputParams } from "./provider";

/**
 * Parameters required to send a request to the endpoint
 */
type ConnectParams = Readonly<[query: string, variables?: ProviderInputParams]>;

/**
 * A connection for the Canvas GraphQL API. This will send a GraphQL query to an endpoint specified in the constructor, defaulting to `canvas.liberty.edu`.
 * This also stores a bearer token which can also be specified in the constructor; the default is what is found in the `CANVAS_AUTH_TOKEN` environment variable.
 */
export default class CanvasProvider<
  ZVal extends z.Schema,
  InputParams extends ProviderInputParams = null,
  OutShape extends z.infer<ZVal> = z.infer<ZVal>
> extends Provider<ConnectParams, OutShape, ZVal, InputParams> {
  private endpoint = "https://canvas.liberty.edu/api/graphql";

  private token = process.env.CANVAS_AUTH_TOKEN;

  protected connect = async (...params: ConnectParams) => {
    const [query, variables] = params;

    const client = new GraphQLClient(this.endpoint).setHeader(
      "authorization",
      `Bearer ${this.token}`
    );
    return client.request<OutShape>(query, variables ? variables : undefined);
  };

  constructor(
    /**
     * A factory function to produce a query to send to the endpoint
     */
    reqFactory: (vars: InputParams) => ConnectParams,
    /**
     * A Zod validator indicating the expected shape of the response
     */
    validator: ZVal,
    /**
     * A set of options to configure this instance of the client.
     * Specify whether to call a different endpoint or use a different authentication token.
     */
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
