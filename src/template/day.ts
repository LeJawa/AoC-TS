import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = new Date().getFullYear();
const day = 1;

const IS_RAW_INPUT = false; // set to true if lines is raw input
const lines = readInput(day, year, IS_RAW_INPUT);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  // TODO: Implement setup
  return [];
}

function part1(input: DayInputType): Solution {
  // TODO: Implement Part 1
  return null;
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

export { setup, part1, part2, IS_RAW_INPUT };
