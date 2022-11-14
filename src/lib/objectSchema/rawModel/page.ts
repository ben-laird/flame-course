import { z } from "zod";
import { page } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type PageShape = z.infer<typeof page[1]>;

export default class Page extends SchemaNode<PageShape> {
  public get id(): number {
    return this.data.id;
  }
}
