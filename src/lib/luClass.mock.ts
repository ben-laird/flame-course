import { MockData } from "../devUtils/test/testTypes";
import Course from "./course";
import { ochemMock, ochemLabMock } from "./course.mock";
import { LUClassParams, LUClassData } from "./luClass";

const ochemClassMock: MockData<LUClassParams, LUClassData> = {
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

export default ochemClassMock;
