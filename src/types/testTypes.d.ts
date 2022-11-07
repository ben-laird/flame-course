import { ExecutionContext } from "ava";

export interface GetterTesterParams<T> {
  getterToTest: keyof T;
  expectedVal: unknown;
}

export interface SetterTesterParams<T, U> {
  errorMessage: string;
  mutator: (t: ExecutionContext<T>) => void;
  expected: U;
}

export interface MockData<Params, Data> {
  input: Params;
  data: Data;
}
