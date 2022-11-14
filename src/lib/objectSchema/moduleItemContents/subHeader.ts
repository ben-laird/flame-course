import { z } from "zod";
import { subHeader } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type SubHeaderShape = z.infer<typeof subHeader[1]>;

export default class SubHeader extends SchemaNode<SubHeaderShape> {
  private _id = Math.random();

  public get id(): number {
    return this._id;
  }
}
