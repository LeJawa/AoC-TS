import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 6;
const lines = readInput(day, year, true);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0].split("\n").filter((line) => line !== "");
}

const doOperation = (operator: string, ...numbers: number[]) => {
  if (operator === "*") {
    return numbers.reduce((mult, n) => mult * n, 1);
  } else return numbers.reduce((sum, n) => sum + n, 0);
};

function part1(lines: DayInputType): Solution {
  const numberArrays = lines
    .slice(0, -1)
    .map((line) => line.split(/ +/).map((x) => parseInt(x)));

  const operators = lines.at(-1)!.trim().split(/ +/);

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

function part2(lines: DayInputType): Solution {
  const numberLines = lines.slice(0, -1);

  const operators = lines.at(-1)!.trim().split(/ +/);

  let index = numberLines[0].length;
  let opIndex = operators.length - 1;

  let result = 0;
  let partialResult: number = undefined!;
  while (index-- > 0) {
    const n = parseInt(
      `${numberLines[0][index]}${numberLines[1][index]}${numberLines[2][index]}${numberLines[3][index]}`
    );

    if (index === 0) {
      result += doOperation(operators[opIndex], partialResult, n);
      break;
    }

    if (isNaN(n)) {
      result += partialResult;
      partialResult = undefined!;
      opIndex--;
      continue;
    }

    if (partialResult === undefined) partialResult = n;
    else partialResult = doOperation(operators[opIndex], partialResult, n);
  }

  return result;
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
