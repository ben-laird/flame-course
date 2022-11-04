import { AnyConnection, ConnectionInfer } from "./connection";

export default class Transformer<Return, Con extends AnyConnection> {
  constructor(
    private connection: Con,
    private transform: (data: ConnectionInfer<Con, "output">) => Return
  ) {}

  public create = async (params: ConnectionInfer<Con, "inputParams">) => {
    const res = await this.connection.call(params);
    return this.transform(res);
  };
}
