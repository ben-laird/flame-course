import { z } from "zod";
import { extUrl } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type ExternalUrlShape = z.infer<typeof extUrl[1]>;

export default class ExternalUrl extends SchemaNode<ExternalUrlShape> {
  public get id(): number {
    return this.data.id;
  }
}
