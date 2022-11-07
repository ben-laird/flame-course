import { gql } from "graphql-request";
import { z } from "zod";
import { FragmentUtil } from "../input";
import { subjectCodesVal } from "./subjects";

export const course = FragmentUtil.create(
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

export const module = FragmentUtil.create(
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

export const moduleItem = FragmentUtil.create(
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

export const subHeader = FragmentUtil.create(
  gql`
    fragment SubHeaderFragment on SubHeader {
      title
    }
  `,
  z.object({
    title: z.string().nullable(),
  })
);

export const page = FragmentUtil.create(
  gql`
    fragment PageFragment on Page {
      id: _id
      title
      createdAt
      updatedAt
    }
  `,
  z.object({
    id: z.number(),
    title: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })
);

export const file = FragmentUtil.create(
  gql`
    fragment FileFragment on File {
      id: _id
      contentType
      url
    }
  `,
  z.object({
    id: z.number(),
    contentType: z.string().nullable(),
    url: z.string().url().nullable(),
  })
);

export const extTool = FragmentUtil.create(
  gql`
    fragment ExtToolFragment on ExternalTool {
      id: _id
      name
      description
      url
    }
  `,
  z.object({
    id: z.number(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    url: z.string().url().nullable(),
  })
);

export const discussion = FragmentUtil.compose([file], ([[fileGQL, fileVal]]) =>
  FragmentUtil.create(
    gql`
      ${fileGQL}
      fragment DiscussionFragment on Discussion {
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

export const quiz = FragmentUtil.create(
  gql`
    fragment QuizFragment on Quiz {
      id: _id
      createdAt
      updatedAt
    }
  `,
  z.object({
    id: z.number(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  })
);

export const extUrl = FragmentUtil.create(
  gql`
    fragment ExtUrlFragment on ExternalUrl {
      id: _id
      title
      extUrl: url
    }
  `,
  z.object({
    id: z.number(),
    title: z.string().nullable(),
    extUrl: z.string().url().nullable(),
  })
);

export const moduleExtTool = FragmentUtil.create(
  gql`
    fragment ModuleExtToolFragment on ModuleExternalTool {
      id: _id
      modUrl: url
    }
  `,
  z.object({
    id: z.number(),
    modUrl: z.string().url().nullable(),
  })
);

export const rubric = FragmentUtil.create(
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

export const submission = FragmentUtil.compose([file], ([[fileGQL, fileVal]]) =>
  FragmentUtil.create(
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

export const assignment = FragmentUtil.compose(
  [rubric, submission],
  ([[rubricGQL, rubricVal], [submissionGQL, submissionVal]]) =>
    FragmentUtil.create(
      gql`
        ${rubricGQL}
        ${submissionGQL}
        fragment AssignmentFragment on Assignment {
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

export const grades = FragmentUtil.create(
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
