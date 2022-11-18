export type UnaryVariadic<T> = [T, ...T[]];

export type UnaryVariadicInfer<T extends UnaryVariadic<unknown>> =
  T extends UnaryVariadic<infer R> ? R : never;
