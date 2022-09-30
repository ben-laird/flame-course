import Course, { CourseData } from "./course";

export interface LUClassParams {
  title: string;
  subterm: LUClassSubterm;
  lectureCourse: Course;
  labCourse?: Course;
}

export interface LUClassData {
  title: string;
  subterm: LUClassSubterm;
  courseLinks: {
    lecture: CourseData;
    lab?: CourseData;
  };
}

export interface CourseLinks {
  lecture: Course;
  lab?: Course;
}

export type LUClassSubterm = "A" | "B" | "C" | "D" | "J";

/**
 * A representation of an LU Class. An LU Class in this library is defined as a set of related courses,
 * whether in a lecture/lab duo, or something from Global Studies, idek what stuff Global Studies does lol.
 */
export default class LUClass {
  /**
   * The title of the class. Make it whatever you'd like!
   */
  private _title: string;

  public get title(): string {
    return this._title;
  }

  private _subterm: LUClassSubterm;

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
  public get subterm(): LUClassSubterm {
    return this._subterm;
  }

  private _courseLinks: CourseLinks;

  /**
   * The set of courses that constitute the class.
   * Generally, classes only consist of one course,
   * but in the case of offerings with a lab component,
   * the lab property will handle this data.
   *
   * @note Online courses will never have extra components like lab.
   */
  public get courses(): CourseLinks | undefined {
    return this._courseLinks;
  }

  public get data(): LUClassData {
    return {
      title: this._title,
      subterm: this._subterm,
      courseLinks: {
        lecture: this._courseLinks.lecture.data,
        lab: this._courseLinks.lab?.data,
      },
    };
  }

  constructor(params: LUClassParams) {
    ({ title: this._title, subterm: this._subterm } = params);

    this._courseLinks = {
      lecture: params.lectureCourse,
      lab: params.labCourse,
    };
  }
}
