import { z } from "zod";
import { module } from "../../constants";
import * as MIC from ".";
import { SchemaLinkedNode } from "../schemaNodes";

type ModuleShape = z.infer<typeof module[1]>;

type ModuleDeps = {
  assignments: MIC.ModuleItem<MIC.Assignment>[];
  discussions: MIC.ModuleItem<MIC.Discussion>[];
  externalTools: MIC.ModuleItem<MIC.ExternalTool>[];
  externalUrls: MIC.ModuleItem<MIC.ExternalUrl>[];
  files: MIC.ModuleItem<MIC.File>[];
  moduleExternalTools: MIC.ModuleItem<MIC.ModuleExternalTool>[];
  pages: MIC.ModuleItem<MIC.Page>[];
  quizzes: MIC.ModuleItem<MIC.Quiz>[];
  subHeaders: MIC.ModuleItem<MIC.SubHeader>[];
};

export default class Module extends SchemaLinkedNode<ModuleShape, ModuleDeps> {
  public get id(): number {
    return this.data.id;
  }
}
