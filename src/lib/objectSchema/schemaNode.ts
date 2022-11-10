import { z } from "zod";

type AnySchemaNode = SchemaNode<AnySchemaNode[], z.Schema>;

export type SchemaNodeInfer<
  T extends AnySchemaNode,
  U extends "dependencies" | "validator" | "shape"
> = T extends SchemaNode<infer Deps, infer ZVal, infer Shape>
  ? { dependencies: Deps; validator: ZVal; shape: Shape }[U]
  : never;

export default abstract class SchemaNode<
  Deps extends AnySchemaNode[],
  ZVal extends z.Schema,
  Shape extends z.infer<ZVal> = z.infer<ZVal>
> {
  protected data: Shape;

  constructor(protected deps: Deps, protected val: ZVal, data: Shape) {
    this.data = val.parse(data) as Shape;
  }
}
