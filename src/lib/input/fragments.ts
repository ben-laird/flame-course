import { z } from "zod";

type Query<ZVal extends z.Schema, Params = null> = Readonly<
  [(variables: Params) => Readonly<[string, Params]>, ZVal]
>;

type Fragment<ZVal extends z.Schema> = Readonly<[string, ZVal]>;

type FragsParams<FragVal extends z.Schema> = [
  Fragment<FragVal>,
  ...Fragment<FragVal>[]
];

type GQLParams = Record<string, string | number> | null;

const createFragment = <ZVal extends z.Schema>(...fragment: Fragment<ZVal>) =>
  fragment;

const applyFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema,
  Params extends GQLParams = null
>(
  frags: Frags,
  builder: (frags: Frags) => Query<OutVal, Params>
) => builder(frags);

const composeFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema
>(
  frags: Frags,
  builder: (frags: Frags) => Fragment<OutVal>
) => builder(frags);

export {
  createFragment as create,
  applyFragments as apply,
  composeFragments as compose,
};
