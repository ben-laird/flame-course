import { Course, CourseParams, LUClass, LUClassParams } from "./objectSchema";
import { courseAPI, modelAPI, singleCourseAPI } from "./utils";

// DONE Switch courseCreator from CanvasConnection to CanvasAPI

export const singleCourseCreator = async (courseId: number) => {
  const connection = (await singleCourseAPI.call({ id: courseId })) as {
    course: CourseParams;
  };

  return new Course(connection.course);
};

export const courseCreator = async () => {
  const connection = (await courseAPI.call(undefined)) as {
    allCourses: Array<CourseParams>;
  };

  return connection.allCourses.map((courseData) => new Course(courseData));
};

export interface LuClassCreatorParams {
  params: Omit<LUClassParams, "lectureCourse" | "labCourse">;
  lectureUrl: string;
  labUrl?: string;
}

export const luClassCreator = async (details: LuClassCreatorParams) => {
  const { params, lectureUrl, labUrl } = details;

  const courseFromUrl = async (url: string) => {
    const match = url.match(/https:\/\/canvas\.liberty\.edu\/courses\/(d{6})/);
    if (match === null)
      throw new Error("One of the urls did not have a course ID!");
    const id = parseInt(match[1]);

    const outputCourse = await singleCourseCreator(id);
    return outputCourse;
  };

  return new LUClass({
    ...params,
    lectureCourse: await courseFromUrl(lectureUrl),
    labCourse: labUrl !== undefined ? await courseFromUrl(labUrl) : undefined,
  });
};

// TODO Add creators

export const modelCreator = async (userId: number) => {
  return modelAPI.call({ id: userId });
};
