import Course from "./course";

/**
 * Capture the details of a single online course,
 * which can then be used to build up an `LUClass`.
 *
 * Note: LU will sometimes use a residential course as if it were an online course,
 * i.e. the class never meets, the location is "Web", etc.
 * These "pseudo-residential" courses are the global general education courses, like UNIV 101.
 * Please use this interface for those courses as well.
 * All sub-examples will use info from Foundational Skills (UNIV 101-B64) (a pseudo-residential)
 * and New Testament Survey (BIBL 110-B).
 */
export default interface OnlineCourse extends Course {}
