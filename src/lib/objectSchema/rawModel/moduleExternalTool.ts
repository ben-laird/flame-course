import { z } from "zod";
import { moduleExtTool } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type ModuleExternalToolShape = z.infer<typeof moduleExtTool[1]>;

export default class ModuleExternalTool extends SchemaNode<ModuleExternalToolShape> {
  public get id(): number {
    return this.data.id;
  }
}
