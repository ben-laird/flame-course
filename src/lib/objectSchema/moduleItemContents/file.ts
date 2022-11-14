import { z } from "zod";
import { file } from "../../constants";
import { SchemaNode } from "../schemaNodes";

type FileShape = z.infer<typeof file[1]>;

export default class File extends SchemaNode<FileShape> {
  public get id(): number {
    return this.data.id;
  }
}
