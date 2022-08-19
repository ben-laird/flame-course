import Assignment from './assignment';

/**
 * A representation of a typical Canvas module
 */
export default interface Module {
  assignments?: Array<Assignment>;
  files?: Array<string>;
}
