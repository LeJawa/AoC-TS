import { readInput, timeIt } from "../common.ts";
import { type Solution } from "../types.ts";

const year = 2018;
const day = 1;
const lines = readInput(day, year);

// Returns the manipulated input lines
function setup(lines: string[]): number[] {
  return lines.map((line) => parseInt(line));
}

function part1(input: typeof dayInput): Solution {
  let frequency = 0;
  input.forEach((change) => (frequency += change));
  return frequency;
}

function part2(input: typeof dayInput): Solution {
  let frequency = 0;
  const set = new Set([0]);

  while (true) {
    for (const change of input) {
      frequency += change;
      if (set.has(frequency)) return frequency;
      set.add(frequency);
    }
  }

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
