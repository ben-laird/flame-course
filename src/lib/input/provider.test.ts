import test from "ava";
import { z } from "zod";
import Provider, { ProviderInputParams } from "./provider";

const mock = ["memes", "superMemes", "hyperMemes", "ultraMemes"];

type TPParams = [number];

class TestProvider<
  ZVal extends z.Schema,
  InputParams extends ProviderInputParams = null,
  OutShape extends z.infer<ZVal> = z.infer<ZVal>
> extends Provider<TPParams, OutShape, ZVal, InputParams> {
  protected connect = async (...params: TPParams) => {
    const [index] = params;

    const output = new Promise((resolve) => {
      resolve(mock[index]);
    });

    return output as OutShape;
  };
}

test("Creating a test provider", async (t) => {
  t.notThrows(
    () =>
      new TestProvider(
        (variables: { index: number }) => [variables.index],
        z.string()
      )
  );
});

test("Returning correct data from the test provider", async (t) => {
  const tp = new TestProvider(
    (variables: { index: number }) => [variables.index],
    z.string()
  );

  const result = await tp.call({ index: 0 });

  t.is(result, mock[0]);
});
