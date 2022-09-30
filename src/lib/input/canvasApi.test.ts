import anyTest, { TestFn } from "ava";
import CanvasAPI from "./canvasApi";

const test = anyTest as TestFn<CanvasAPI>;

test.beforeEach("Construct example Canvas API class", (t) => {
  t.context = new CanvasAPI();
});

test.failing("Canvas API constructed correctly", (t) => {
  const expected = {
    invalidateInterval: 2000,
    query: 0,
    responseCache: {
      course: {
        _id: "308038",
        name: "CHEM301: Organic Chemistry I (001)",
      },
    },
  };
  const actual = t.context.data;
  t.deepEqual(actual, expected, "Canvas API was not constructed correctly!");
});
