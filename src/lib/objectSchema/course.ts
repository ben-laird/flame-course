// TODO Add full documentation

export interface CourseParams {
  _id: string;
  name: string;
  courseCode: string | null;
}

export interface CourseData {
  title: string;
  canvasId: number;
  code?: CourseCode;
}

export interface CourseCode {
  subject: string;
  course: number;
  section: number;
}

// TODO Add date functionality

// TODO Add grade functionality

/**
 * Capture the details of a single representation of a residential course,
 * which can then be used to build up an `LUClass`.
 * All sub-examples will use info from Organic Chemistry I (CHEM 301-001).
 */
export default class Course {
  private _title: string;
  /**
   * The title of the course, i.e. `"Organic Chemistry I"`
   */
  public get title(): string {
    return this._title;
  }
  public set title(title: string) {
    this._title = title;
  }

  private _canvasId: number;
  /**
   * The identifier of the course in the Canvas system, e.g. `308038`
   */
  public get canvasId(): number {
    return this._canvasId;
  }
  public set canvasId(id: string | number) {
    if (typeof id === "string") this._canvasId = parseInt(id);
    else this._canvasId = id;
  }

  private _code?: CourseCode;

  public get canvasCourseCode(): string {
    if (this._code === undefined)
      throw new Error("Course code info was not found!");
    const paddedSection = String(this._code.section).padStart(3, "0");

    return `${this._code.subject}${this._code.course}_${paddedSection}`;
  }
  public get standardCourseCode(): CourseCode | undefined {
    return this._code;
  }

  public set courseCode(code: string | CourseCode | undefined) {
    if (typeof code === "string") {
      const re = /(?:(\w{4})(\d{3})L?_(\d{3})_\d{4}\d{2})|(?:[\w ]+)/;

      const matches = re.exec(code);
      if (matches === null)
        throw new Error("Course code provided does not match code format!");

      this._code = {
        subject: matches[1],
        course: parseInt(matches[2]) || 0,
        section: parseInt(matches[3]) || 0,
      };
    } else this._code = code;
  }

  public get data(): CourseData {
    return {
      title: this._title,
      canvasId: this._canvasId,
      code: this._code,
    };
  }

  constructor(params: CourseParams) {
    const matches = params.name.match(
      /(?:\w{4}\d{3}L?: (.+) \(\d{3}\))|(?:\w+)/
    );
    this._title = matches === null ? "" : matches[1];
    this.canvasId = params._id;
    this.courseCode =
      params.courseCode === null ? undefined : params.courseCode;
    this._canvasId = parseInt(params._id);
  }
}
