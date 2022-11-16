import { z } from "zod";
import { moduleItem } from "../../constants";
import { AnySchemaNode, SchemaLinkedNode } from "../schemaNodes";

type ModuleItemShape = z.infer<typeof moduleItem[1]>;

type ModuleItemDeps<Wrapped extends AnySchemaNode> = {
  item: [Wrapped];
};

export default class ModuleItem<
  Wrapped extends AnySchemaNode
> extends SchemaLinkedNode<ModuleItemShape, ModuleItemDeps<Wrapped>> {
  public get id(): number {
    return this.data.id;
  }
}
