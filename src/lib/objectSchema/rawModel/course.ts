import { z } from "zod";
import { course } from "../../constants";
import Module from "./module";
import { SchemaLinkedNode } from "../schemaNodes";

type CourseShape = z.infer<typeof course[1]>;

type CourseDeps = {
  modules: Module[];
};

export default class Course extends SchemaLinkedNode<CourseShape, CourseDeps> {
  public get id(): number {
    return this.data.id;
  }
}
