export type AnySchemaNode = SchemaNode<Record<string, unknown>>;

export type SchemaNodeInfer<T extends AnySchemaNode> = T extends SchemaNode<
  infer Shape
>
  ? Shape
  : never;

export abstract class SchemaNode<Shape extends Record<string, unknown>> {
  constructor(protected data: Shape) {}

  public get wrappedData() {
    return this.data;
  }

  public abstract get id(): number;
}

type AnyDependencies = Record<string, AnySchemaNode[]>;

// type AnySchemaLinkedNode = SchemaLinkedNode<AnyDependencies, z.Schema>;

export abstract class SchemaLinkedNode<
  Shape extends Record<string, unknown>,
  Deps extends AnyDependencies
> extends SchemaNode<Shape> {
  constructor(data: Shape, protected deps: Deps) {
    super(data);
  }

  public get wrappedDataAndDependencies() {
    const { data, dependencies } = this;

    return [data, dependencies];
  }

  public get dependencies() {
    return this.deps;
  }

  public add = (section: keyof Deps, ...dependencies: Deps[typeof section]) => {
    this.deps[section].push(...dependencies);

    return this;
  };

  public pop = (section: keyof Deps) => this.deps[section].pop();
}
