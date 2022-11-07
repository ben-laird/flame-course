import test from "ava";
import { gql } from "graphql-request";
import { z } from "zod";
import { apply, compose } from "./fragments";

const courseFrag = [
  gql`
    fragment CourseFrag on Course {
      id: _id
      name
      state
    }
  `,
  z.object({
    id: z.number(),
    name: z.string(),
    state: z.string(),
  }),
] as const;

const sectionFrag = [
  gql`
    fragment SectionFrag on Section {
      id: _id
      name
      userCount
    }
  `,
  z.object({
    id: z.number(),
    name: z.string(),
    userCount: z.number(),
  }),
] as const;

test("Joining fragments together", (t) => {
  const actualComposedFragments = compose([sectionFrag], (frags) => {
    const [section] = frags;

    const [gqlFragment, sectionVal] = section;

    return [
      gql`
        ${gqlFragment}
        fragment TestCourseFrag on Course {
          id: _id
          name
          state
          sections: sectionsConnection {
            nodes {
              ...SectionFrag
            }
          }
        }
      `,
      z.object({
        id: z.number(),
        name: z.string(),
        state: z.string(),
        sections: z.object({
          nodes: sectionVal.array(),
        }),
      }),
    ] as const;
  });

  const expectedComposedFragments = [
    () => {
      const [frag] = sectionFrag;
      return gql`
        ${frag}
        fragment TestCourseFrag on Course {
          id: _id
          name
          state
          sections: sectionsConnection {
            nodes {
              ...SectionFrag
            }
          }
        }
      `;
    },
    z.object({
      id: z.number(),
      name: z.string(),
      state: z.string(),
      sections: z.object({
        nodes: z
          .object({
            id: z.number(),
            name: z.string(),
            userCount: z.number(),
          })
          .array(),
      }),
    }),
  ] as const;

  const [actualComposedQuery, actualComposeVal] = actualComposedFragments;

  const [expectedComposeQuery, expectedComposeVal] = expectedComposedFragments;

  t.deepEqual(
    actualComposedQuery,
    expectedComposeQuery(),
    "Base factory was not composed correctly!"
  );

  const exampleResponse = {
    id: 5,
    name: "Example",
    state: "Done",
    sections: {
      nodes: [
        {
          id: 1,
          name: "Node1",
          userCount: 18,
        },
        {
          id: 2,
          name: "Node2",
          userCount: 23,
        },
      ],
    },
  };

  t.deepEqual(
    actualComposeVal.parse(exampleResponse),
    expectedComposeVal.parse(exampleResponse),
    "Base validator was not composed correctly!"
  );
});

test("Applying a fragment to a base", (t) => {
  const query = gql`
    query ApplyFragTest($id: ID!) {
      User: legacyNode(_id: $id, type: User) {
        ... on User {
          enrollments {
            course {
              ...CourseFrag
            }
          }
        }
      }
    }
  `;

  const actualBase = apply([courseFrag], (frags) => {
    const [course] = frags;

    const [gqlFragment, courseVal] = course;

    return [
      (variables: { id: number }) =>
        [
          gql`
            fragment Safety on SubHeader {
              title
            }
            ${gqlFragment}
            ${query}
          `,
          variables,
        ] as const,
      z.object({
        User: z.object({
          enrollments: z
            .object({
              course: courseVal,
            })
            .array(),
        }),
      }),
    ] as const;
  });

  const expectedBase = [
    () => {
      const [frag] = courseFrag;
      return (variables: { id: number }) =>
        [
          gql`
            fragment Safety on SubHeader {
              title
            }
            ${frag}
            ${query}
          `,
          variables,
        ] as const;
    },
    z.object({
      User: z.object({
        enrollments: z
          .object({
            course: z.object({
              id: z.number(),
              name: z.string(),
              state: z.string(),
            }),
          })
          .array(),
      }),
    }),
  ] as const;

  const [actualBaseFactory, actualBaseVal] = actualBase;

  const [expectedBaseFactory, expectedBaseVal] = expectedBase;

  t.deepEqual(
    actualBaseFactory({ id: 5 }),
    expectedBaseFactory()({ id: 5 }),
    "Base factory was not composed correctly! id: 5"
  );

  t.deepEqual(
    actualBaseFactory({ id: 271828 }),
    expectedBaseFactory()({ id: 271828 }),
    "Base factory was not composed correctly! id: 271828"
  );

  const exampleResponse = {
    User: {
      enrollments: [
        {
          course: {
            id: 1,
            name: "Course 1",
            state: "Done",
          },
        },
        {
          course: {
            id: 2,
            name: "Course 2",
            state: "In Progress",
          },
        },
      ],
    },
  } as const;

  t.deepEqual(
    actualBaseVal.parse(exampleResponse),
    expectedBaseVal.parse(exampleResponse),
    "Base validator was not composed correctly!"
  );
});

test("Applying multiple fragments to a base", (t) => {
  const query = gql`
    query ApplyMultipleFragsTest($id: ID!) {
      User: legacyNode(_id: $id, type: User) {
        ... on User {
          enrollments {
            course {
              ...CourseFrag
            }
            section {
              ...SectionFrag
            }
          }
        }
      }
    }
  `;

  const actualBase = apply([courseFrag, sectionFrag], (frags) => {
    const [course, section] = frags;

    const [courseGqlFragment, courseVal] = course;

    const [sectionGqlFragment, sectionVal] = section;

    return [
      (variables: { id: number }) =>
        [
          gql`
            fragment Safety on SubHeader {
              title
            }
            ${sectionGqlFragment}
            ${courseGqlFragment}
            ${query}
          `,
          variables,
        ] as const,
      z.object({
        User: z.object({
          enrollments: z
            .object({
              course: courseVal,
              section: sectionVal,
            })
            .array(),
        }),
      }),
    ] as const;
  });

  const expectedBase = [
    () => {
      const [courseGqlFrag] = courseFrag;
      const [sectionGqlFrag] = sectionFrag;

      return (variables: { id: number }) =>
        [
          gql`
            fragment Safety on SubHeader {
              title
            }
            ${sectionGqlFrag}
            ${courseGqlFrag}
            ${query}
          `,
          variables,
        ] as const;
    },
    z.object({
      User: z.object({
        enrollments: z
          .object({
            course: z.object({
              id: z.number(),
              name: z.string(),
              state: z.string(),
            }),
            section: z.object({
              id: z.number(),
              name: z.string(),
              userCount: z.number(),
            }),
          })
          .array(),
      }),
    }),
  ] as const;

  const [actualBaseFactory, actualBaseVal] = actualBase;

  const [expectedBaseFactory, expectedBaseVal] = expectedBase;

  t.deepEqual(
    actualBaseFactory({ id: 5 }),
    expectedBaseFactory()({ id: 5 }),
    "Base factory was not composed correctly! id: 5"
  );

  t.deepEqual(
    actualBaseFactory({ id: 271828 }),
    expectedBaseFactory()({ id: 271828 }),
    "Base factory was not composed correctly! id: 271828"
  );

  const exampleResponse = {
    User: {
      enrollments: [
        {
          course: {
            id: 1,
            name: "Course 1",
            state: "Done",
          },
          section: {
            id: 1,
            name: "Node 1",
            userCount: 18,
          },
        },
        {
          course: {
            id: 2,
            name: "Course 2",
            state: "In Progress",
          },
          section: {
            id: 2,
            name: "Node 2",
            userCount: 23,
          },
        },
        {
          course: {
            id: 3,
            name: "Course 3",
            state: "Done",
          },
          section: {
            id: 3,
            name: "Node 3",
            userCount: 31,
          },
        },
        {
          course: {
            id: 4,
            name: "Course 4",
            state: "In Progress",
          },
          section: {
            id: 4,
            name: "Node 4",
            userCount: 15,
          },
        },
      ],
    },
  };

  t.deepEqual(
    actualBaseVal.parse(exampleResponse),
    expectedBaseVal.parse(exampleResponse),
    "Base validator was not composed correctly!"
  );
});
