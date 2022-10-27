import * as Schema from "./lib/objectSchema";
import * as Create from "./lib/creators";

export const FlameCourse = { ...Schema, ...Create };
export { Schema };
export { Create };
