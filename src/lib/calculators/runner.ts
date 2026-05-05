import { calculatorRegistry } from "./registry";

type Registry = typeof calculatorRegistry;
export type CalculatorName = keyof Registry;

export function runCalculator<TName extends CalculatorName>(
  name: TName,
  input: Parameters<Registry[TName]["calculate"]>[0],
): {
  name: string;
  result: ReturnType<Registry[TName]["calculate"]>;
  interpretation: string;
} {
  const engine = calculatorRegistry[name];

  const calculate = engine.calculate as (
    value: Parameters<Registry[TName]["calculate"]>[0],
  ) => ReturnType<Registry[TName]["calculate"]>;

  const interpret = engine.interpret as (
    result: ReturnType<Registry[TName]["calculate"]>,
    value: Parameters<Registry[TName]["calculate"]>[0],
  ) => string;

  const result = calculate(input);

  return {
    name: engine.name,
    result,
    interpretation: interpret(result, input),
  };
}
