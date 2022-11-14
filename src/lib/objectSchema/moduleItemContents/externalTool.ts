import { z } from "zod";
import { extTool } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type ExternalToolShape = z.infer<typeof extTool[1]>;

export default class ExternalTool extends SchemaNode<ExternalToolShape> {
  public get id(): number {
    return this.data.id;
  }
}
