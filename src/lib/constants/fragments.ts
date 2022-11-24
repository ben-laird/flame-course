import { gql } from "graphql-request";
import { z } from "zod";
import { FragmentUtil } from "../input";
import { subjectCodesVal } from "./subjects";

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a grade or a set of grades.
 */
export const grades = FragmentUtil.createFragment(
  gql`
    fragment GradesFragment on Grades {
      currentGrade
      currentScore
      finalGrade
      finalScore
      unpostedCurrentGrade
      unpostedCurrentScore
      unpostedFinalGrade
      unpostedFinalScore
    }
  `,
  z.object({
    currentGrade: z.string().nullable(),
    currentScore: z.number().nullable(),
    finalGrade: z.string().nullable(),
    finalScore: z.number().nullable(),
    unpostedCurrentGrade: z.string().nullable(),
    unpostedCurrentScore: z.number().nullable(),
    unpostedFinalGrade: z.string().nullable(),
    unpostedFinalScore: z.number().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for an enrollment.
 */
export const enrollment = FragmentUtil.compose(
  [grades],
  ([[gradesGQL, gradesVal]]) =>
    FragmentUtil.createFragment(
      gql`
        ${gradesGQL}
        fragment EnrollmentFragment on Enrollment {
          id: _id
          state
          htmlUrl
          grades {
            ...GradesFragment
          }
        }
      `,
      z.object({
        id: z.number(),
        state: z.string(),
        htmlUrl: z.string().url().nullable(),
        grades: gradesVal.nullable(),
      })
    )
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a course.
 */
export const course = FragmentUtil.createFragment(
  gql`
    fragment CourseFragment on Course {
      id: _id
      name
      courseCode
    }
  `,
  z.object({
    id: z.number(),
    name: z.string(),
    courseCode: subjectCodesVal.nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a module.
 */
export const module = FragmentUtil.createFragment(
  gql`
    fragment ModuleFragment on Module {
      id: _id
      name
      position
    }
  `,
  z.object({
    id: z.number(),
    name: z.string().nullable(),
    position: z.number().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a module item.
 */
export const moduleItem = FragmentUtil.createFragment(
  gql`
    fragment ModuleItemFragment on ModuleItem {
      id: _id
      url
    }
  `,
  z.object({
    id: z.number(),
    url: z.string().url().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a subheader.
 */
export const subHeader = FragmentUtil.createFragment(
  gql`
    fragment SubHeaderFragment on SubHeader {
      type: __typename
      title
    }
  `,
  z.object({
    type: z.literal("SubHeader"),
    title: z.string().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a page.
 */
export const page = FragmentUtil.createFragment(
  gql`
    fragment PageFragment on Page {
      type: __typename
      id: _id
      title
      createdAt
      updatedAt
    }
  `,
  z.object({
    type: z.literal("Page"),
    id: z.number(),
    title: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a file.
 */
export const file = FragmentUtil.createFragment(
  gql`
    fragment FileFragment on File {
      type: __typename
      id: _id
      contentType
      url
    }
  `,
  z.object({
    type: z.literal("File"),
    id: z.number(),
    contentType: z.string().nullable(),
    url: z.string().url().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for an external tool.
 */
export const extTool = FragmentUtil.createFragment(
  gql`
    fragment ExtToolFragment on ExternalTool {
      type: __typename
      id: _id
      name
      description
      url
    }
  `,
  z.object({
    type: z.literal("ExternalTool"),
    id: z.number(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    url: z.string().url().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a discussion.
 */
export const discussion = FragmentUtil.compose([file], ([[fileGQL, fileVal]]) =>
  FragmentUtil.createFragment(
    gql`
      ${fileGQL}
      fragment DiscussionFragment on Discussion {
        type: __typename
        id: _id
        title
        entries: discussionEntriesConnection {
          posts: nodes {
            id: _id
            author {
              id: _id
              name
              shortName
              pronouns
            }
            message
            attachment {
              ...FileFragment
            }
            subentriesCount
            createdAt
            updatedAt
          }
        }
      }
    `,
    z.object({
      type: z.literal("Discussion"),
      id: z.number(),
      title: z.string().nullable(),
      entries: z
        .object({
          posts: z
            .object({
              id: z.number(),
              author: z
                .object({
                  id: z.number(),
                  name: z.string().nullable(),
                  shortname: z.string().nullable(),
                  pronouns: z.string().nullable(),
                })
                .nullable(),
              message: z.string().nullable(),
              attachment: fileVal.nullable(),
              subentriesCount: z.number().nullable(),
              createdAt: z.date().nullable(),
              updatedAt: z.date().nullable(),
            })
            .nullable()
            .array()
            .nullable(),
        })
        .nullable(),
    })
  )
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a quiz.
 */
export const quiz = FragmentUtil.createFragment(
  gql`
    fragment QuizFragment on Quiz {
      type: __typename
      id: _id
      createdAt
      updatedAt
    }
  `,
  z.object({
    type: z.literal("Quiz"),
    id: z.number(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for an external URL.
 */
export const extUrl = FragmentUtil.createFragment(
  gql`
    fragment ExtUrlFragment on ExternalUrl {
      type: __typename
      id: _id
      title
      extUrl: url
    }
  `,
  z.object({
    type: z.literal("ExternalUrl"),
    id: z.number(),
    title: z.string().nullable(),
    extUrl: z.string().url().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a module's external tool.
 */
export const moduleExtTool = FragmentUtil.createFragment(
  gql`
    fragment ModuleExtToolFragment on ModuleExternalTool {
      type: __typename
      id: _id
      modUrl: url
    }
  `,
  z.object({
    type: z.literal("ModuleExternalTool"),
    id: z.number(),
    modUrl: z.string().url().nullable(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a rubric.
 */
export const rubric = FragmentUtil.createFragment(
  gql`
    fragment RubricFragment on Rubric {
      id: _id
      title
      pointsPossible
      criteria {
        id: _id
        description
        longDescription
        points
      }
    }
  `,
  z.object({
    id: z.number(),
    title: z.string().nullable(),
    pointsPossible: z.number().nullable(),
    criteria: z
      .object({
        id: z.number(),
        description: z.string().nullable(),
        longDescription: z.string().nullable(),
        points: z.number().nullable(),
      })
      .array(),
  })
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for a submission.
 */
export const submission = FragmentUtil.compose([file], ([[fileGQL, fileVal]]) =>
  FragmentUtil.createFragment(
    gql`
      ${fileGQL}
      fragment SubmissionFragment on Submission {
        id: _id
        gradingStatus
        submittedAt
        grade
        score
        enteredGrade
        enteredScore
        late
        missing
        isCurrent: gradeMatchesCurrentSubmission
        latePolicyStatus
        attachment {
          ...FileFragment
        }
      }
    `,
    z.object({
      id: z.number(),
      gradingStatus: z
        .enum(["needs_grading", "excused", "needs_review", "graded"])
        .nullable(),
      submittedAt: z.date().nullable(),
      grade: z.string().nullable(),
      score: z.number().nullable(),
      enteredGrade: z.string().nullable(),
      enteredScore: z.number().nullable(),
      late: z.boolean().nullable(),
      missing: z.boolean().nullable(),
      isCurrent: z.boolean().nullable(),
      latePolicyStatus: z
        .enum(["late", "missing", "extended", "none"])
        .nullable(),
      attachment: fileVal.nullable(),
    })
  )
);

/**
 * A pre-fabricated GraphQL fragment and validator to specify arguments for an assignment.
 */
export const assignment = FragmentUtil.compose(
  [rubric, submission],
  ([[rubricGQL, rubricVal], [submissionGQL, submissionVal]]) =>
    FragmentUtil.createFragment(
      gql`
        ${rubricGQL}
        ${submissionGQL}
        fragment AssignmentFragment on Assignment {
          type: __typename
          id: _id
          name
          description
          url: htmlUrl
          pointsPossible
          rubric {
            ...RubricFragment
          }
          createdAt
          dueAt
          lockAt
          updatedAt
          state
          allowedAttempts
          submissions: submissionsConnection {
            grades: nodes {
              ...SubmissionFragment
            }
          }
        }
      `,
      z.object({
        type: z.literal("Assignment"),
        id: z.number(),
        name: z.string().nullable(),
        description: z.string().nullable(),
        url: z.string().url().nullable(),
        pointsPossible: z.number().nullable(),
        rubric: rubricVal.nullable(),
        createdAt: z.date().nullable(),
        dueAt: z.date().nullable(),
        lockAt: z.date().nullable(),
        updatedAt: z.date().nullable(),
        state: z.enum([
          "unpublished",
          "published",
          "deleted",
          "duplicating",
          "failed_to_duplicate",
          "importing",
          "fail_to_import",
          "migrating",
          "failed_to_migrate",
        ]),
        allowedAttempts: z.number().nullable(),
        submissions: z
          .object({
            grades: submissionVal.nullable().array().nullable(),
          })
          .nullable(),
      })
    )
);
