import { z } from "zod";
import { discussion } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type DiscussionShape = z.infer<typeof discussion[1]>;

export default class Discussion extends SchemaNode<DiscussionShape> {
  public get id(): number {
    return this.data.id;
  }
}
