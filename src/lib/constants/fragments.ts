import { gql } from "graphql-request";
import { z } from "zod";
import { FragUtil } from "../input";
import { subjectCodesVal } from "./subjects";

export const course = [
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
  }),
] as const;

export const module = [
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
  }),
] as const;

export const moduleItem = [
  gql`
    fragment ModuleItemFragment on ModuleItem {
      id: _id
      url
    }
  `,
  z.object({
    id: z.number(),
    url: z.string().url().nullable(),
  }),
] as const;

export const subHeader = [
  gql`
    fragment SubHeaderFragment on SubHeader {
      title
    }
  `,
  z.object({
    title: z.string().nullable(),
  }),
] as const;

export const page = [
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
  }),
] as const;

export const file = [
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
  }),
] as const;

export const extTool = [
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
  }),
] as const;

export const discussion = FragUtil.compose([file], ([file]) => {
  const [fileGQL, fileVal] = file;
  return [
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
              attachment: fileVal,
              subentriesCount: z.number().nullable(),
              createdAt: z.date().nullable(),
              updatedAt: z.date().nullable(),
            })
            .nullable()
            .array()
            .nullable(),
        })
        .nullable(),
    }),
  ] as const;
});

export const quiz = [
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
  }),
] as const;

export const extUrl = [
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
  }),
] as const;

export const moduleExtTool = [
  gql`
    fragment ModuleExtToolFragment on ModuleExternalTool {
      id: _id
      modUrl: url
    }
  `,
  z.object({
    id: z.number(),
    modUrl: z.string().url().nullable(),
  }),
] as const;

export const rubric = [
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
  }),
] as const;

export const submission = FragUtil.compose([file], ([file]) => {
  const [fileGQL, fileVal] = file;

  return [
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
      gradingStatus: z.string().nullable(),
      submittedAt: z.date().nullable(),
      grade: z.string().nullable(),
      score: z.number().nullable(),
      enteredGrade: z.string().nullable(),
      enteredScore: z.number().nullable(),
      late: z.boolean().nullable(),
      missing: z.boolean().nullable(),
      isCurrent: z.boolean().nullable(),
      latePolicyStatus: z.string().nullable(),
      attachment: fileVal.nullable(),
    }),
  ];
});

export const assignment = FragUtil.compose(
  [rubric, submission],
  ([rubricFrag, fileFrag]) => {
    const [rubricGQL, rubricVal] = rubricFrag;
    const [submissionGQL, submissionVal] = fileFrag;

    return [
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
        state: z.string(), // Need to update this to z.enum()
        allowedAttempts: z.number().nullable(),
        submissions: z
          .object({
            grades: submissionVal.nullable().array().nullable(),
          })
          .nullable(),
      }),
    ] as const;
  }
);

export const grades = [
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
  }),
] as const;
