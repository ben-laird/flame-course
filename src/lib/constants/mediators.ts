import { modelProvider } from ".";
import * as Med from "../mediators";
import { Raw } from "../objectSchema";

export const modelMediator = new Med.ProviderMediator(
  modelProvider,
  ({ Model }) =>
    Model.enrollments.flatMap(({ course, id }) =>
      course
        ? [
            new Raw.Enrollment(
              { id },
              {
                course: [
                  new Raw.Course(
                    {
                      id: course.id,
                      name: course.name,
                      courseCode: course.courseCode,
                    },
                    {
                      modules: course.modulesConnection?.modules
                        ? course.modulesConnection.modules.flatMap((module) =>
                            module
                              ? [
                                  new Raw.Module(
                                    {
                                      id: module.id,
                                      name: module.name,
                                      position: module.position,
                                    },
                                    {
                                      assignments: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "Assignment"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.Assignment(
                                                            content
                                                          ),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      discussions: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "Discussion"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.Discussion(
                                                            content
                                                          ),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      externalTools: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "ExternalTool"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.ExternalTool(
                                                            content
                                                          ),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      externalUrls: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "ExternalUrl"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.ExternalUrl(
                                                            content
                                                          ),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      files: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "File"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.File(content),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      moduleExternalTools: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type ===
                                              "ModuleExternalTool"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.ModuleExternalTool(
                                                            content
                                                          ),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      pages: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "Page"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.Page(content),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      quizzes: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "Quiz"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.Quiz(content),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                      subHeaders: module.items
                                        ? module.items.flatMap(
                                            ({ id, url, content }) =>
                                              content?.type === "SubHeader"
                                                ? [
                                                    new Raw.ModuleItem(
                                                      { id, url },
                                                      {
                                                        item: [
                                                          new Raw.SubHeader(
                                                            content
                                                          ),
                                                        ],
                                                      }
                                                    ),
                                                  ]
                                                : []
                                          )
                                        : [],
                                    }
                                  ),
                                ]
                              : []
                          )
                        : [],
                    }
                  ),
                ],
              }
            ),
          ]
        : []
    )
);
