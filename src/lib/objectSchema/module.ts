import Assignment from "./assignment";

// TODO Fully implement Module class

/**
 * A representation of a typical Canvas module
 */
export default interface Module {
  assignments?: Array<Assignment>;
  files?: Array<string>;
}
