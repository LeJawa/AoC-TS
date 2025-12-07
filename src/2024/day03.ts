import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 3;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return Array.from(
    lines.join("\n").match(/(mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\))/g)!
  );
}

function part1(matches: DayInputType): Solution {
  let fullMultiplicationSum = 0;

  for (const match of matches.filter((match) => match.startsWith("mul"))) {
    const [a, b] = match.match(/\d+/g)!;
    const mul = parseInt(a) * parseInt(b);
    fullMultiplicationSum += mul;
  }

  return fullMultiplicationSum;
}

function part2(matches: DayInputType): Solution {
  let conditionalMultiplicationSum = 0;
  let enableMult = true;

  for (const match of matches) {
    if (match === "do()") enableMult = true;
    else if (match === "don't()") enableMult = false;
    else {
      const [a, b] = match.match(/\d+/g)!;
      const mul = parseInt(a) * parseInt(b);
      if (enableMult) conditionalMultiplicationSum += mul;
    }
  }

  return conditionalMultiplicationSum;
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

export { setup, part1, part2 };
