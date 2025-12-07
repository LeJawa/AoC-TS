import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 5;
const lines = readInput(day, year);

type DayInputType = () => number[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return () => lines.map((line) => parseInt(line));
}

function part1(getInstructions: DayInputType): Solution {
  const instructions = getInstructions();
  let steps = 0;
  let index = 0;

  while (index >= 0 && index < instructions.length) {
    steps++;
    instructions[index]++;
    index += instructions[index] - 1;
  }

  return steps;
}

function part2(getInstructions: DayInputType): Solution {
  const instructions = getInstructions();
  let steps = 0;
  let index = 0;

  while (index >= 0 && index < instructions.length) {
    const oldIndex = index;
    steps++;
    index += instructions[oldIndex];
    instructions[oldIndex] += instructions[oldIndex] < 3 ? 1 : -1;
  }

  return steps;
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
