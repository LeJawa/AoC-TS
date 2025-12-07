import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 17;
const lines = readInput(day, year);

type DayInputType = number;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return parseInt(lines[0]);
}

function part1(step: DayInputType): Solution {
  let buffer = [0];
  let pos = 0;

  for (let i = 1; i <= 2017; i++) {
    pos = ((pos + step) % buffer.length) + 1;
    buffer = buffer.slice(0, pos).concat(i).concat(buffer.slice(pos));
  }

  return buffer[pos + 1];
}

function part2(step: DayInputType): Solution {
  let pos = 0;
  let target = 0;

  for (let i = 1; i <= 50e6; i++) {
    pos = ((pos + step) % i) + 1;
    if (pos - 1 === 0) target = i;
  }
  return target;
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
