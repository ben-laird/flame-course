import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyConnection = Connection<any, any[], any, z.Schema>;

export type ConnectionInfer<
  T extends AnyConnection,
  U extends "inputParams" | "connectParams" | "val" | "output"
> = T extends Connection<infer R1, infer R2, infer R3, infer R4>
  ? { inputParams: R1; connectParams: R2; val: R3; output: R4 }[U]
  : never;

export default abstract class Connection<
  InputParams,
  ConnectParams extends [...unknown[]],
  OutShape extends z.infer<ZVal>,
  ZVal extends z.Schema
> {
  protected abstract connect: (...params: ConnectParams) => Promise<OutShape>;

  public call = async (params: InputParams) => {
    const body = this.transformer(params);
    const readData = await this.connect(...body);

    return this.validator.parse(readData) as OutShape;
  };

  constructor(
    protected transformer: (params: InputParams) => ConnectParams,
    protected validator: ZVal
  ) {}
}
