import { readInput, timeIt } from "../common";
import { permutations } from "../lib/math";
import { type Solution } from "../types";

const year = 2017;
const day = 2;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

function part1(lines: DayInputType): Solution {
  let checksum = 0;
  for (const line of lines) {
    let max = 0;
    let min = Infinity;
    line
      .split("\t")
      .map((x) => parseInt(x))
      .forEach((n) => {
        if (n > max) max = n;
        else if (n < min) min = n;
      });
    checksum += max - min;
  }

  return checksum;
}

function part2(lines: DayInputType): Solution {
  let checksum = 0;
  for (const line of lines) {
    const allPermutations = permutations(
      line.split("\t").map((x) => parseInt(x)),
      2
    );
    for (const [a, b] of allPermutations) {
      if (a % b === 0) checksum += Math.floor(a / b);
    }
  }

  return checksum;
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
