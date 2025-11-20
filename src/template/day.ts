import { readInput, timeIt } from "../common.ts";
import { Solution } from "../types.ts";

const year = new Date().getFullYear();
const day = 1;
const lines = readInput(day, year);

// Returns the manipulated input lines
function setup(lines: string[]): any {
  // TODO: Implement setup
  return null;
}

function part1(input: typeof dayInput): Solution {
  // TODO: Implement Part 1
  return null;
}

function part2(input: typeof dayInput): Solution {
  // TODO: Implement Part 2
  return null;
}

const { result: dayInput, time: timeSetup } = timeIt(() => setup(lines));

export function main() {
  console.log(`Day ${day} - Setup (${timeSetup})`);

  const { result: answer1, time: time1 } = timeIt(() => part1(dayInput));
  console.log(`Day ${day} - Part 1:`, answer1, `(${time1})`);

  const { result: answer2, time: time2 } = timeIt(() => part2(dayInput));
  console.log(`Day ${day} - Part 2:`, answer2, `(${time2})`);
}
