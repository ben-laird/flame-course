/**
 * Capture the details of a single representation of a residential course,
 * which can then be used to build up an `LUClass`.
 * All sub-examples will use info from Organic Chemistry I (CHEM 301-001).
 */
export default interface Course<SecCode = string> {
  /** The title of the course, e.g. `"Organic Chemistry I"` */
  title: string;
  /** The identifier of the course in the Canvas system, e.g. `"CHEM 301-001"` */
  id: {
    /** The code for the subject the course is under, e.g. `"CHEM"` */
    subjectCode: string;
    /**
     * The code for the course itself, e.g. `301`.
     * Lab courses will have an "L" after the number, e.g. `"301L"`
     */
    courseCode: number;
    /** The code for the course section, e.g. `001` or `1` */
    sectionCode: SecCode;
  };
  /** The course's description */
  description?: string;
  /**
   * The professor teaching the course.
   * If there is no professor, use the placeholder value `"TBA"`
   */
  professor: string | 'TBA';
  /**
   * How long the course meets or when the course could potentially meet.
   * This value can be easily found on the Course Registration tool.
   */
  duration: { startDate: Date; endDate: Date; elapsedTime: number };
  /** An object to encode the course's grade status */
  grade: {
    credits: 0 | 1 | 2 | 3 | 4;
    /** The total number of points the course has, oftentimes 1000 points */
    totalPoints: number;
    /**
     * The current number of points scored in the course.
     * This is the sum of all graded assignments' scores in raw points out of the `totalPoints` value
     */
    currentPoints: number;
    /**
     * The current number of points that could have been awarded in the course.
     * This is the sum of all graded assignments' possible points.
     */
    accountedPoints: number;
    gradePercent: number;
    gradeLetter: 'A' | 'B' | 'C' | 'D' | 'F';
  };
  modules?: Array<string>;
}
