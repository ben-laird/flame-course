import Enrollment from "./enrollment";
import { SchemaLinkedNode } from "../schemaNodes";

type RawModelShape = { id: number };

type RawModelDeps = {
  enrollments: Enrollment[];
};

export default class RawModel extends SchemaLinkedNode<
  RawModelShape,
  RawModelDeps
> {
  public get id(): number {
    return this.data.id;
  }
}
