import { z } from "zod";
import { ConnectionInputParams, ConnectionTransformer } from "./connection";

// const emptyFunction = () => undefined;
// type Empty = Parameters<typeof emptyFunction>;
// Can use this (^) to model a function with no arguments

type Query<ZVal extends z.Schema, Params extends GQLParams = null> = Readonly<
  [(variables: Params) => Readonly<[string, Params]>, ZVal]
>;

type Fragment<ZVal extends z.Schema> = Readonly<[string, ZVal]>;

type FragsParams<FragVal extends z.Schema> = [
  Fragment<FragVal>,
  ...Fragment<FragVal>[]
];

type GQLParams = Record<string, string | number> | null;

export const createFragment = <ZVal extends z.Schema>(
  ...fragment: Fragment<ZVal>
) => fragment;

export const createQuery = <
  ZVal extends z.Schema,
  Params extends ConnectionInputParams = null
>(
  ...query: Query<ZVal, Params>
) => query;

export const createTransformer = <
  ConnectParams extends ReadonlyArray<unknown>,
  Params extends ConnectionInputParams = null
>(
  transformer: ConnectionTransformer<ConnectParams, Params>
) => transformer;

const applyFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema,
  Params extends ConnectionInputParams = null
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

export { applyFragments as apply, composeFragments as compose };
