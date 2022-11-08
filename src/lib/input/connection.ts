import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConnection = Connection<Readonly<any[]>, any, z.Schema, any>;

export type ConnectionInputParams = Record<string, string | number> | null;

export type ConnectionTransformer<
  ConnectParams extends ReadonlyArray<unknown>,
  Params extends ConnectionInputParams = null
> = ((variables: Params) => ConnectParams) | (() => ConnectParams);

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

export default abstract class Connection<
  ConnectParams extends ReadonlyArray<unknown>,
  OutShape extends z.infer<ZVal>,
  ZVal extends z.Schema,
  InputParams extends ConnectionInputParams = null
> {
  protected abstract connect: (...params: ConnectParams) => Promise<OutShape>;

  public call = async (params: InputParams) => {
    const body = this.transformer(params);
    const readData = await this.connect(...body);

    return this.validator.parse(readData) as OutShape;
  };

  constructor(
    protected transformer: ConnectionTransformer<ConnectParams, InputParams>,
    protected validator: ZVal
  ) {}
}
