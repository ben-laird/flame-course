import { gql } from "graphql-request";
import { z } from "zod";
import { CanvasAPI } from "./input";
import { Course, CourseParams, LUClass, LUClassParams } from "./objectSchema";

// DONE Switch courseCreator from CanvasConnection to CanvasAPI

export const singleCourseCreator = async (courseId: number) => {
  const connection = (await new CanvasAPI({
    req: {
      query: gql`
        query CourseCreatorWithId($id: ID!) {
          course(id: $id) {
            _id
            name
            courseCode
          }
        }
      `,
      variables: { id: courseId },
    },
    val: z.object({
      course: z.object({
        _id: z.string(),
        name: z
          .string()
          .regex(
            /(?:\w{3,4}\d{3}L?: .+ \(\d{3}\))|(?:\w+)/,
            "Name didn't match regex!"
          ),
        courseCode: z
          .string()
          .regex(
            /(?:\w{3,4}\d{3}L?_\d{3}_\d{4}\d{2})|(?:[\w ]+)/,
            "Course code didn't match regex!"
          )
          .nullable(),
      }),
    }),
  }).call()) as { course: CourseParams };

  return new Course(connection.course);
};

export const courseCreator = async () => {
  const connection = (await new CanvasAPI({
    req: {
      query: gql`
        query CourseCreatorNoId {
          allCourses {
            _id
            name
            courseCode
          }
        }
      `,
    },
    val: z.object({
      allCourses: z
        .object({
          _id: z.string(),
          name: z
            .string()
            .regex(
              /(?:\w{3,4}\d{3}L?: .+ \(\d{3}\))|(?:\w+)/,
              "Name didn't match regex!"
            ),
          courseCode: z
            .string()
            .regex(
              /(?:\w{3,4}\d{3}L?_\d{3}_\d{4}\d{2})|(?:[\w ]+)/,
              "Course code didn't match regex!"
            )
            .nullable(),
        })
        .array(),
    }),
  }).call()) as { allCourses: Array<CourseParams> };

  return connection.allCourses.map((courseData) => new Course(courseData));
};

interface LuClassCreatorParams {
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
  const connection = new CanvasAPI({
    req: {
      query: gql`
        query modelCreator($id: ID!) {
          legacyNode(_id: $id, type: User) {
            ... on User {
              __typename
              enrollments {
                _id
                course {
                  _id
                  name
                  courseCode
                }
                section {
                  _id
                  name
                }
                state
              }
            }
          }
        }
      `,
      variables: { id: userId },
    },
    val: z.object({
      user: z.object({
        __typename: z.string(),
        enrollments: z
          .object({
            _id: z.string(),
            course: z.object({
              _id: z.string(),
              name: z.string(),
              courseCode: z.string(),
            }),
          })
          .array(),
        section: z.object({
          _id: z.string(),
          name: z.string(),
        }),
        state: z.string(),
      }),
    }),
  });

  return connection.call();
};
