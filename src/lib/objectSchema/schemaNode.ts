import { z } from "zod";

type AnySchemaNode = SchemaNode<z.Schema>;

export type SchemaNodeInfer<T extends AnySchemaNode> = T extends SchemaNode<
  z.Schema,
  infer Shape
>
  ? Shape
  : never;

export abstract class SchemaNode<
  ZVal extends z.Schema,
  Shape extends z.infer<ZVal> = z.infer<ZVal>
> {
  constructor(protected val: ZVal, protected data: Shape) {
    val.parse(data);
  }

  public get wrappedData() {
    return this.data;
  }
}

type AnyDependencies = Record<string, AnySchemaNode[]>;

// type AnySchemaLinkedNode = SchemaLinkedNode<AnyDependencies, z.Schema>;

export abstract class SchemaLinkedNode<
  Deps extends AnyDependencies,
  ZVal extends z.Schema,
  Shape extends z.infer<ZVal> = z.infer<ZVal>
> extends SchemaNode<ZVal> {
  constructor(protected deps: Deps, val: ZVal, data: Shape) {
    super(val, data);
  }

  public get wrappedData() {
    const { data, dependencies } = this;

    return { data, dependencies };
  }

  public get dependencies() {
    return this.deps;
  }

  public add = (section: keyof Deps, ...dependencies: Deps[typeof section]) => {
    this.deps[section].push(...dependencies);

    return this;
  };
}
