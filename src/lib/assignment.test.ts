import anyTest, { TestFn } from "ava";
import Assignment from "./assignment";

const test = anyTest as TestFn<{ task: Assignment }>;

test.beforeEach((t) => {
  t.context.task = new Assignment("Homework", 100, undefined, {
    score: 95,
    description: "Something really fun lol",
  });
});

const assignmentTestMacro = test.macro(
  (t, propToTest: keyof Assignment, expectedValue: unknown) => {
    const assertion = t.context.task[propToTest] === expectedValue;
    t.assert(
      assertion,
      `Assignment property ${propToTest} did not match what was specified`
    );
  }
);

test("Task name is correct", assignmentTestMacro, "name", "Homework");

test("Task point value is correct", assignmentTestMacro, "totalPoints", 100);

test("Task score is correct", assignmentTestMacro, "score", 95);

test(
  "Task description is correct",
  assignmentTestMacro,
  "description",
  "Something really fun lol"
);
