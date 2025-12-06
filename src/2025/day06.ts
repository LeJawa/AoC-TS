import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 6;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

const doOperation = (operator: string, ...numbers: number[]) => {
  if (operator === "*") {
    return numbers.reduce((mult, n) => mult * n, 1);
  } else return numbers.reduce((sum, n) => sum + n, 0);
};

function part1(lines: DayInputType): Solution {
  const splitLines = lines.map((line) => {
    return line.split(/ +/);
  });

  const numberArrays = splitLines
    .slice(0, -1)
    .map((line) => line.map((x) => parseInt(x)));

  const operators = splitLines.at(-1)!;

  let result = 0;

  for (let i = 0; i < operators.length; i++) {
    result += doOperation(
      operators[i],
      numberArrays[0][i],
      numberArrays[1][i],
      numberArrays[2][i],
      numberArrays[3][i]
    );
  }

  return result;
}

function part2(input: DayInputType): Solution {
  // TODO: Implement Part 2
  return null;
}

export async function main() {
  console.log(`Day ${day}:`);

  const { result: dayInput, time: time0 } = await timeIt(() => setup(lines));
  console.log(` > Setup (${time0})`);

  const { result: answer1, time: time1 } = await timeIt(() => part1(dayInput));
  console.log(` > Part 1:`, answer1, `(${time1})`);

  const { result: answer2, time: time2 } = await timeIt(() => part2(dayInput));
  console.log(` > Part 2:`, answer2, `(${time2})`);
}

export { part1, part2 };
