import { AnyConnection, ConnectionInfer } from "../input/connection";

/**
 * Transform data from a connection into a useable piece of data
 */
export default class ProviderMediator<Return, Con extends AnyConnection> {
  /**
   * Transform data from a connection into a useable piece of data
   * @param connection the connection to use
   * @param mediator the function to use when transforming incoming data. The `data` parameter is fully typed.
   */
  constructor(
    private connection: Con,
    private mediator: (data: ConnectionInfer<Con, "output">) => Return
  ) {}

  /**
   * Create a data set by calling the connection and transforming the incoming data
   * @param params parameters needed to call for data from the connection
   * @returns a transformed data set using the `transform` function
   */
  public create = async (params: ConnectionInfer<Con, "inputParams">) => {
    const res = await this.connection.call(params);
    return this.mediator(res);
  };
}
