/**
 * A representation of an assignment seen on Canvas.
 */
export default class Assignment {
  /**
   * The name of the assignment, seen at the top-level header
   */
  name: string;
  /**
   * The total amount of points this assignment is worth,
   * typically out of the total points for the class.
   */
  totalPoints: number;
  /**
   * The number of points scored for the work done on the assignment.
   * This is optional to allow for adding the score in later on.
   */
  score?: number;
  /**
   * The date the assignment is due as listed on Canvas, if any.
   */
  dueDate?: Date;
  /**
   * The description of the assignment as listed on Canvas, if any.
   */
  description?: string;
  /**
   * The date the assignment was added to Canvas.
   * This is optional to allow for adding the info later on.
   */
  addedDate?: Date;

  constructor(
    name: string,
    totalPoints: number,
    dueDate?: Date,
    details?: { score?: number; description?: string; addedDate?: Date }
  ) {
    this.name = name;
    this.totalPoints = totalPoints;
    this.dueDate = dueDate;
    this.score = details?.score;
    this.description = details?.description;
    this.addedDate = details?.addedDate;
  }
}
