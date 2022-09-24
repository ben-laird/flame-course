import anyTest, { ExecutionContext, TestFn } from "ava";
import { z } from "zod";
import Course from "./course";

const test = anyTest as TestFn<{ course: Course }>;

const standardExpected = {
  title: "Organic Chemistry I",
  canvasId: 308038,
  code: { subject: "CHEM", course: 301, section: 1 },
};

/*
================================
Test Macros
================================
*/

const getterTester = test.macro(
  (t, getterToTest: keyof Course, expectedVal: unknown) => {
    const actual = t.context.course[getterToTest];
    const expected = expectedVal as typeof actual;

    t.deepEqual(
      actual,
      expected,
      `${getterToTest} doesn't match what was expected!`
    );
  }
);

const setterTester = test.macro(
  (
    t,
    params: {
      errorMessage: string;
      mutator: (t: ExecutionContext<{ course: Course }>) => void;
      expected: {
        title: string;
        canvasId: number;
        code?: { subject: string; course: number; section: number };
      };
    }
  ) => {
    const { errorMessage, mutator, expected } = params;
    const { title, canvasId, code } = expected;

    mutator(t);

    const val = z.object({
      title: z.string().regex(new RegExp(title)),
      canvasId: z.number().gte(canvasId).lte(canvasId),
      code: z
        .object({
          subject: z.string().regex(new RegExp(code?.subject || "")),
          course: z
            .number()
            .gte(code?.course || 0)
            .lte(code?.course || 0),
          section: z
            .number()
            .gte(code?.section || 0)
            .lte(code?.section || 0),
        })
        .optional(),
    });

    const zInterpreted = val.parse(t.context.course.data);

    t.deepEqual(zInterpreted, expected, errorMessage);
  }
);

// Set up new Course instance before each test
test.beforeEach((t) => {
  t.context.course = new Course({
    _id: "308038",
    courseCode: "CHEM301_001_202240",
    name: "CHEM301: Organic Chemistry I (001)",
  });
});

// Constructor test
test("Course constructed correctly", (t) => {
  const val = z.object({
    title: z.string().regex(/Organic Chemistry I/),
    canvasId: z.number().gte(308038).lte(308038),
    code: z
      .object({
        subject: z.string().regex(/CHEM/),
        course: z.number().gte(301).lte(301),
        section: z.number().gte(1).lte(1),
      })
      .optional(),
  });

  const zInterpreted = val.parse(t.context.course.data);
  t.deepEqual(
    zInterpreted,
    standardExpected,
    "Course data doesn't match expected value!"
  );
});

/*
================================
Getter Testers
================================
*/

test(
  "Canvas course code getter",
  getterTester,
  "canvasCourseCode",
  "CHEM301_001"
);

test("Canvas course code getter (uh-oh, _code === undefined)", (t) => {
  t.context.course.courseCode = undefined;

  t.throws(
    () => t.context.course.canvasCourseCode,
    {
      message: "Course code info was not found!",
    },
    "Course code getter did not throw the proper error!"
  );
});

test("Canvas ID getter", getterTester, "canvasId", 308038);

test("Standard course code getter", getterTester, "standardCourseCode", {
  subject: "CHEM",
  course: 301,
  section: 1,
});

test("Canvas title getter", getterTester, "title", "Organic Chemistry I");

/*
================================
Setter Testers
================================
*/

test("Title setter", setterTester, {
  mutator: (t) => {
    t.context.course.title = "Abstract Algebra I";
  },
  expected: {
    ...standardExpected,
    title: "Abstract Algebra I",
  },
  errorMessage: "Title wasn't set correctly!",
});

test("Canvas ID setter (string)", setterTester, {
  mutator: (t) => {
    t.context.course.canvasId = "9000";
  },
  expected: {
    ...standardExpected,
    canvasId: 9000,
  },
  errorMessage: "Title wasn't set correctly!",
});

test("Canvas ID setter (number)", setterTester, {
  mutator: (t) => {
    t.context.course.canvasId = 9000;
  },
  expected: {
    ...standardExpected,
    canvasId: 9000,
  },
  errorMessage: "Title wasn't set correctly!",
});

test("Course code setter (undefined)", setterTester, {
  mutator: (t) => {
    t.context.course.courseCode = undefined;
  },
  expected: {
    ...standardExpected,
    code: undefined,
  },
  errorMessage: "Course code wasn't set correctly!",
});

test("Course code setter (uh-oh val)", (t) => {
  t.throws(
    () => {
      t.context.course.courseCode = "";
    },
    { message: "Course code provided does not match code format!" },
    "Course code setter did not throw the right error!"
  );
});
