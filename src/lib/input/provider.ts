import { z } from "zod";

/**
 * A type for any possible connection. Use this in type parameters to specify any sort of connection that extends the Connection abstract class.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConnection = Connection<Readonly<any[]>, any, z.Schema, any>;

/**
 * A type specifying input parameters for a given connection
 */
export type ConnectionInputParams = Record<string, string | number> | null;

/**
 * A type specifying the expected shape of a request factory, aka a Connection transformer.
 */
export type ConnectionTransformer<
  ConnectParams extends ReadonlyArray<unknown>,
  Params extends ConnectionInputParams = null
> = ((variables: Params) => ConnectParams) | (() => ConnectParams);

/**
 * Infer the properties of a connection, i.e. any class that extends the Connection abstract class
 */
export type ConnectionInfer<
  T extends AnyConnection,
  U extends "inputParams" | "connectParams" | "val" | "output"
> = T extends Connection<
  infer ConnectParams,
  infer Output,
  infer ZVal,
  infer InputParams
>
  ? {
      inputParams: InputParams;
      connectParams: ConnectParams;
      val: ZVal;
      output: Output;
    }[U]
  : never;

/**
 * An abstract class representing a connection to an API endpoint, database, or other source of data.
 */
export default abstract class Connection<
  ConnectParams extends ReadonlyArray<unknown>,
  OutShape extends z.infer<ZVal>,
  ZVal extends z.Schema,
  InputParams extends ConnectionInputParams = null
> {
  protected abstract connect: (...params: ConnectParams) => Promise<OutShape>;

  /**
   * Call for data from the data source and validate that the data matches what is expected according to the validator
   * @param params the parameters specified in the transformer function's arguments
   * @returns a piece of data in the shape specified by the validator
   */
  public call = async (params: InputParams) => {
    const body = this.transformer(params);
    const readData = await this.connect(...body);

    return this.validator.parse(readData) as OutShape;
  };

  constructor(
    /**
     * A factory function/transformer to produce a query to send to the data source
     */
    protected transformer: ConnectionTransformer<ConnectParams, InputParams>,
    /**
     * A Zod validator indicating the expected shape of the response
     */
    protected validator: ZVal
  ) {}
}
