// import OnlineCourse from "./onlineCourse";
import Course from "./course";

/**
 * A representation of an LU Class. An LU Class in this library is defined as a set of related courses,
 * whether in a lecture/lab duo, or something from Global Studies, idek what stuff Global Studies does lol.
 */
export default interface LUClass {
  /**
   * The title of the class. Make it whatever you'd like!
   */
  title: string;
  /**
   * The emoji that refers to this class.
   * This is mostly for organization and can be safely ignored if emoji-coding isn't your style.
   */
  emojiCode?: string;
  /**
   * The identifier of the subterm the course takes place in.
   *
   * Subterms split a semester into smaller timeframes to accommodate LU's shorter classes.
   * 16-week courses will be in the A-term.
   * 8-week courses starting the first quarter of the semester will be in the B-term,
   * while those starting the second quarter of the semester will be in the D-term.
   * 8-week courses that start midway through a semester will be in the C-term.
   * Note that C-term courses are not offered over the summer.
   * Intensives will be in the J-term.
   * The J-term starts about a week before the A-term.
   */
  subterm: "A" | "B" | "C" | "D" | "J";
  /**
   * The set of courses that constitute the class.
   * Generally, classes only consist of one course, but in the case of offerings with a lab component,
   * the {@linkcode labCourse} will handle this data.
   *
   * @note Online courses will never have extra components like lab.
   */
  courses: {
    /**
     * The lecture component of the offering.
     */
    lectureCourse: Course; // | OnlineCourse;
    /**
     * The lab component of the offering, if any.
     */
    labCourse?: Course;
  };
}
