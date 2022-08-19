import LUClass from './luClass';

/**
 * A representation of a semester at Liberty.
 */
export default interface Semester {
  /** The term the semester takes place in */
  term: 'Fall' | 'Winter' | 'Spring' | 'Summer';
  /**
   * The array of classes you're taking this semester.
   * Note that classes are separate from courses, see {@linkcode LUClass} for more info.
   */
  classes?: Array<LUClass>;
}
