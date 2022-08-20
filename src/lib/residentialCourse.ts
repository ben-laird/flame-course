import Course from "./course";

/**
 * Capture the details of a single residential course,
 * which can then be used to build up an `LUClass`.
 * All sub-examples will use info from Organic Chemistry I (CHEM 301-001).
 */
export default interface ResidentialCourse extends Course<number> {
  /**
   * The days and times the course will meet each week.
   * Times should be in EST for easy data entry and processing.
   */
  classTimes: { days: string; startTime: string; endTime: string };
  /** The location of the course on Liberty's campus */
  location?: string;
}
