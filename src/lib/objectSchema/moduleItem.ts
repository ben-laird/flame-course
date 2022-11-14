import { z } from "zod";
import { discussion } from "../constants";
import * as MIC from "./moduleItemContents";
import { SchemaLinkedNode } from "./schemaNodes";

type ModuleItemShape = z.infer<typeof discussion[1]>;

type ModuleItemDeps = {
  assignments: MIC.Assignment[];
  discussions: MIC.Discussion[];
  externalTools: MIC.ExternalTool[];
  externalUrls: MIC.ExternalUrl[];
  files: MIC.File[];
  moduleExternalTools: MIC.ModuleExternalTool[];
  pages: MIC.Page[];
  quizzes: MIC.Quiz[];
  subHeaders: MIC.SubHeader[];
};

export default class ModuleItem extends SchemaLinkedNode<
  ModuleItemShape,
  ModuleItemDeps
> {
  public get id(): number {
    return this.data.id;
  }
}
