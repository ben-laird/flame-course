import { z } from "zod";
import { ConnectionInputParams, ConnectionTransformer } from "./connection";

/**
 * A type specifying the shape of a GraphQL query factory with a Zod validator attached
 */
type Query<
  ZVal extends z.Schema,
  Params extends ConnectionInputParams = null
> = Readonly<[(variables: Params) => Readonly<[string, Params]>, ZVal]>;

/**
 * A GraphQL fragment
 */
type Fragment<ZVal extends z.Schema> = Readonly<[string, ZVal]>;

/**
 * Parameters for applying or composing fragments
 */
type FragsParams<FragVal extends z.Schema> = [
  Fragment<FragVal>,
  ...Fragment<FragVal>[]
];

/**
 * A helper to create a fragment, complete with automatic type handling
 * @param fragment a GraphQL fragment and Zod validator
 * @returns A fully-typed GraphQL fragment with validator
 */
export const createFragment = <ZVal extends z.Schema>(
  ...fragment: Fragment<ZVal>
) => fragment;

/**
 * A helper to create a query, complete with automatic type handling. Spread the returned value over a `Canvas` instance for easy class creation.
 * @param query a GraphQL query factory and Zod validator
 * @returns a fully-typed GraphQL query with validator
 */
export const createQuery = <
  ZVal extends z.Schema,
  Params extends ConnectionInputParams = null
>(
  ...query: Query<ZVal, Params>
) => query;

/**
 * A helper to create a Connection transformer/factory, complete with automatic type handling.
 * Spread the returned value over any extension of the `Connection` class for easy class creation.
 * @param transformer a general Connection transformer
 * @returns a fully-typed Connection transformer
 */
export const createTransformer = <
  ConnectParams extends ReadonlyArray<unknown>,
  Params extends ConnectionInputParams = null
>(
  transformer: ConnectionTransformer<ConnectParams, Params>
) => transformer;

/**
 * Apply GraphQL fragments to a query using a query builder. Use `createQuery` in the `return` statement for best results.
 * @param frags the GraphQL fragments to apply
 * @param builder a factory function that gets passed the fragments and returns a GraphQL query and validator. Use `createQuery` when returning for best results.
 * @returns a fully-typed query with fragments grafted in
 */
const applyFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema,
  Params extends ConnectionInputParams = null
>(
  frags: Frags,
  builder: (frags: Frags) => Query<OutVal, Params>
) => builder(frags);

/**
 * Compose GraphQL fragments to another fragment using a fragment builder. use `createFragment` in the `return` statement for best results.
 * @param frags the GraphQL fragments to apply
 * @param builder a factory function that gets passed the fragments and returns a GraphQL fragment and validator. Use `createFragment` when returning for best results.
 * @returns a fully-typed fragment with the specified fragments grafted in
 */
const composeFragments = <
  Frags extends FragsParams<z.Schema>,
  OutVal extends z.Schema
>(
  frags: Frags,
  builder: (frags: Frags) => Fragment<OutVal>
) => builder(frags);

export { applyFragments as apply, composeFragments as compose };
