import { z } from "zod";
import { module } from "../../constants";
import ModuleItem from "./moduleItem";
import { SchemaLinkedNode } from "../schemaNodes";

type ModuleShape = z.infer<typeof module[1]>;

type ModuleDeps = {
  moduleItems: ModuleItem[];
};

export default class Module extends SchemaLinkedNode<ModuleShape, ModuleDeps> {
  public get id(): number {
    return this.data.id;
  }
}
