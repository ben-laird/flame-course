import Course from "./course";
import { SchemaLinkedNode } from "./schemaNodes";

type RawModelShape = { id: number };

type RawModelDeps = {
  courses: Course[];
};

export default class RawModel extends SchemaLinkedNode<
  RawModelShape,
  RawModelDeps
> {
  public get id(): number {
    return this.data.id;
  }
}
