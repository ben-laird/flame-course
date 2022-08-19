import anyTest, { TestFn } from "ava";
import Assignment from "./assignment";

const test = anyTest as TestFn<{ task: Assignment }>;

test.beforeEach((t) => {
  t.context.task = new Assignment("Homework", 100);
});

test("Task name is correct", (t) => {
  const assertion = t.context.task.name === "Homework";
  t.assert(assertion, "Task name did not match what was specfied");
});

test("Task point value is correct", (t) => {
  const assertion = t.context.task.totalPoints === 100;
  t.assert(assertion, "Task point did not match what was specfied");
});
