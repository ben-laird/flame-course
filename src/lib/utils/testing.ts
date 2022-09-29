import { ExecutionContext } from "ava";
import Course, { CourseData, CourseParams } from "../course";
import { LUClassData, LUClassParams } from "../luClass";

export interface GetterTesterParams<T> {
  getterToTest: keyof T;
  expectedVal: unknown;
}

export interface SetterTesterParams<T, U> {
  errorMessage: string;
  mutator: (t: ExecutionContext<T>) => void;
  expected: U;
}

interface MockData<Params, Data> {
  input: Params;
  data: Data;
}

export const ochemMock: MockData<CourseParams, CourseData> = {
  input: {
    _id: "308038",
    courseCode: "CHEM301_001_202240",
    name: "CHEM301: Organic Chemistry I (001)",
  },
  data: {
    title: "Organic Chemistry I",
    canvasId: 308038,
    code: { subject: "CHEM", course: 301, section: 1 },
  },
};

export const ochemLabMock: MockData<CourseParams, CourseData> = {
  input: {
    _id: "305021",
    courseCode: "CHEM301L_008_202240",
    name: "CHEM301L: Organic Chemistry I Lab (008)",
  },
  data: {
    title: "Organic Chemistry I Lab",
    canvasId: 305021,
    code: { subject: "CHEM", course: 301, section: 8 },
  },
};

export const ochemClassMock: MockData<LUClassParams, LUClassData> = {
  input: {
    title: "O-Chem",
    subterm: "A",
    lectureCourse: new Course(ochemMock.input),
    labCourse: new Course(ochemLabMock.input),
  },
  data: {
    title: "O-Chem",
    subterm: "A",
    courseLinks: {
      lecture: ochemMock.data,
      lab: ochemLabMock.data,
    },
  },
};
