import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 1;
const lines = readInput(day, year);

type DayInputType = { sorted1: number[]; sorted2: number[] };

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const list1: number[] = [];
  const list2: number[] = [];

  lines.forEach((line) => {
    const [a, b] = line.split("   ");
    list1.push(parseInt(a));
    list2.push(parseInt(b));
  });

  const sorted1 = list1.sort((a, b) => a - b);
  const sorted2 = list2.sort((a, b) => a - b);

  return { sorted1, sorted2 };
}

function part1({ sorted1, sorted2 }: DayInputType): Solution {
  let distance = 0;

  sorted1.forEach((_, i) => {
    distance += Math.abs(sorted1[i] - sorted2[i]);
  });

  return distance;
}

function part2({ sorted1, sorted2 }: DayInputType): Solution {
  let similarity = 0;

  sorted1.forEach((n) => {
    const first = sorted2.findIndex((value) => value == n);
    if (first != -1) {
      const last = sorted2.findLastIndex((value) => value == n);

      similarity += n * (last - first + 1);
    }
  });

  return similarity;
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
