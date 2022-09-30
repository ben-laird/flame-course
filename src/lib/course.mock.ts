import { CourseData, CourseParams } from "./course";
import { MockData } from "../devUtils/test/testTypes";

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
