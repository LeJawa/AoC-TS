import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2018;
const day = 1;
const lines = readInput(day, year);

type DayInputType = number[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) => parseInt(line));
}

function part1(input: DayInputType): Solution {
  let frequency = 0;
  input.forEach((change) => (frequency += change));
  return frequency;
}

function part2(input: DayInputType): Solution {
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

export async function main() {
  console.log(`Day ${day}:`);

  const { result: dayInput, time: time0 } = await timeIt(() => setup(lines));
  console.log(` > Setup (${time0})`);

  const { result: answer1, time: time1 } = await timeIt(() => part1(dayInput));
  console.log(` > Part 1:`, answer1, `(${time1})`);

  const { result: answer2, time: time2 } = await timeIt(() => part2(dayInput));
  console.log(` > Part 2:`, answer2, `(${time2})`);
}
