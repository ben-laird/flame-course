import Course from "./course";
import { SchemaLinkedNode } from "../schemaNodes";

type EnrollmentShape = { id: number };

type EnrollmentDeps = {
  course: [Course];
};

export default class Enrollment extends SchemaLinkedNode<
  EnrollmentShape,
  EnrollmentDeps
> {
  public get id(): number {
    return this.data.id;
  }
}
