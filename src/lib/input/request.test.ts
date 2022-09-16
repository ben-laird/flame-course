import test from "ava";
import { CanvasConnection } from "./request";

test("Canvas endpoint returns data", async (t) => {
  const assertion = await new CanvasConnection().call();
  t.assert(assertion, "The Canvas endpoint is not working as expected!");
});
