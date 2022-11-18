import { UnaryVariadic } from "../utils";
import { AnySchemaNode } from "../objectSchema/schemaNodes";

/**
 * Transform data from a schema node into something else, like a different schema
 */
export default class NodeMediator<
  Return,
  Nodes extends UnaryVariadic<AnySchemaNode>
> {
  /**
   * Transform data from a schema node into something else, like a different schema
   * @param nodes the nodes to use when transforming
   * @param mediator the function to use when transforming the given nodes. the `data` parameter is fully typed.
   */
  constructor(
    private nodes: Nodes,
    private mediator: (data: Nodes) => Return
  ) {}

  /**
   * Create a new schema by using the given nodes and transforming the schema
   * @returns a transformed schema using the `mediator` function
   */
  public create = () => this.mediator(this.nodes);
}
