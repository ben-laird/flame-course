import { AnyConnection, ConnectionInfer } from "./connection";

/**
 * Transform data from a connection into a useable piece of data
 */
export default class Transformer<Return, Con extends AnyConnection> {
  /**
   * Transform data from a connection into a useable piece of data
   * @param connection the connection to use
   * @param transform the function to use when transforming incoming data. The `data` parameter is fully typed.
   */
  constructor(
    /**
     * The connection to use
     */
    private connection: Con,
    /**
     * The function to use when transforming incoming data. the `data` parameter is fully typed.
     */
    private transform: (data: ConnectionInfer<Con, "output">) => Return
  ) {}

  /**
   * Create a data set by calling the connection and transforming the incoming data
   * @param params parameters needed to call for data from the connection
   * @returns a transformed data set using the `transform` function
   */
  public create = async (params: ConnectionInfer<Con, "inputParams">) => {
    const res = await this.connection.call(params);
    return this.transform(res);
  };
}
