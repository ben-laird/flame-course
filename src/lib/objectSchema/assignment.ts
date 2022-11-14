import { z } from "zod";
import { assignment } from "../constants";
import { SchemaNode } from "./schemaNodes";

type AssignmentShape = z.infer<typeof assignment[1]>;

export default class Assignment extends SchemaNode<AssignmentShape> {
  public get id(): number {
    return this.data.id;
  }

  public get info() {
    const { id, name, description, state } = this.data;

    return { id, name, description, state };
  }

  public get mostRecentScore() {
    const out = this.data.submissions?.grades?.at(-1)?.score;
    return out ? out : undefined;
  }

  public get percentage() {
    const score = this.mostRecentScore;
    const points = this.data.pointsPossible;

    return score && points && points !== 0 ? score / points : undefined;
  }

  public get rubric() {
    return this.data.rubric;
  }
}
