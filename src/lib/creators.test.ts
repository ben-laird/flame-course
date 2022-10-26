import test from "ava";
import { courseCreator } from "./creators";

test("Creator function returns data", async (t) => {
  const courses = await courseCreator();
  console.log(courses + "");
  t.assert(courses, "Courses array contains no data!");
});
