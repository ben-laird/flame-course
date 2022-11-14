import { z } from "zod";
import { quiz } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type QuizShape = z.infer<typeof quiz[1]>;

export default class Quiz extends SchemaNode<QuizShape> {
  public get id(): number {
    return this.data.id;
  }
}
