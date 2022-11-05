import { z } from "zod";

type Query<ZVal extends z.Schema, Params = null> = Readonly<
  [(variables: Params) => Readonly<[string, Params]>, ZVal]
>;

type Fragment<ZVal extends z.Schema> = Readonly<[string, ZVal]>;

type FragsParams<FragVal extends z.Schema> = [
  Readonly<Fragment<FragVal>>,
  ...Readonly<Fragment<FragVal>>[]
];

type GQLParams = Record<string, string | number> | null;

const applyFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema,
  Params extends GQLParams = null
>(
  frags: Frags,
  builder: (frags: Frags) => Query<OutVal, Params>
) => builder(frags);

export const joinFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema
>(
  frags: Frags,
  builder: (frags: Frags) => Fragment<OutVal>
) => builder(frags);

export default applyFragments;
