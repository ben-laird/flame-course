import { z } from "zod";
import { module } from "../../constants";
import Module from "./module";
import { SchemaLinkedNode } from "../schemaNodes";

type CourseShape = z.infer<typeof module[1]>;

type CourseDeps = {
  moduleItems: Module[];
};

export default class Course extends SchemaLinkedNode<CourseShape, CourseDeps> {
  public get id(): number {
    return this.data.id;
  }
}
