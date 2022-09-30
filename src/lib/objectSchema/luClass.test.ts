import anyTest, { TestFn } from "ava";
import Course from "./course";
import { ochemLabMock, ochemMock } from "./course.mock";
import LUClass, { CourseLinks, LUClassData } from "./luClass";
import ochemClassMock from "./luClass.mock";

interface Subject {
  class: LUClass;
}

interface GetterTesterParams {
  getterToTest: keyof LUClass;
  expectedVal: unknown;
}

const test = anyTest as TestFn<Subject>;

/*
=======================================
Test Macros
=======================================
*/

const getterTester = test.macro((t, params: GetterTesterParams) => {
  const { getterToTest, expectedVal } = params;
  const expected = expectedVal as typeof actual;
  const actual = t.context.class[getterToTest];

  t.deepEqual(
    actual,
    expected,
    `${getterToTest} doesn't match what was expected!`
  );
});

// Set up new LUClass instance before each test
test.beforeEach((t) => {
  t.context.class = new LUClass(ochemClassMock.input);
});

/*
=======================================
Getter Tests
=======================================
*/

test("Title getter", getterTester, {
  getterToTest: "title",
  expectedVal: ochemClassMock.data.title,
});

test("Subterm getter", getterTester, {
  getterToTest: "subterm",
  expectedVal: ochemClassMock.data.subterm,
});

test("Courses getter", (t) => {
  const actual = t.context.class.courses;
  const expected: CourseLinks = {
    lecture: new Course(ochemMock.input),
    lab: new Course(ochemLabMock.input),
  };

  t.deepEqual(actual, expected, "Courses doesn't match what is expected!");
});

test("Class is constructed correctly", (t) => {
  t.deepEqual(
    t.context.class.data,
    ochemClassMock.data,
    "LU Class was not constructed correctly!"
  );
});

test("Class without optionals constructed correctly", (t) => {
  const subject = new LUClass({
    ...ochemClassMock.input,
    labCourse: undefined,
  });

  const expected: LUClassData = {
    ...ochemClassMock.data,
    courseLinks: {
      lecture: ochemClassMock.data.courseLinks.lecture,
      lab: undefined,
    },
  };

  t.deepEqual(
    subject.data,
    expected,
    "LU Class was not constructed correctly!"
  );
});
