import { readInput, timeIt } from "../common";
import { max } from "../lib/math";
import { type Solution } from "../types";

const year = 2017;
const day = 11;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0].split(",");
}

const abs = Math.abs;

function part1(steps: DayInputType): Solution {
  let q = 0,
    r = 0,
    s = 0;

  for (const step of steps) {
    switch (step) {
      case "n":
        r -= 1;
        s += 1;
        break;
      case "s":
        r += 1;
        s -= 1;
        break;
      case "nw":
        q -= 1;
        s += 1;
        break;
      case "se":
        q += 1;
        s -= 1;
        break;
      case "ne":
        q += 1;
        r -= 1;
        break;
      case "sw":
        q -= 1;
        r += 1;
        break;
    }
  }

  return Math.floor((abs(q) + abs(r) + abs(s)) / 2);
}

function part2(steps: DayInputType): Solution {
  let q = 0,
    r = 0,
    s = 0;
  let maxDistance = 0;

  for (const step of steps) {
    switch (step) {
      case "n":
        r -= 1;
        s += 1;
        break;
      case "s":
        r += 1;
        s -= 1;
        break;
      case "nw":
        q -= 1;
        s += 1;
        break;
      case "se":
        q += 1;
        s -= 1;
        break;
      case "ne":
        q += 1;
        r -= 1;
        break;
      case "sw":
        q -= 1;
        r += 1;
        break;
    }

    maxDistance = max(Math.floor((abs(q) + abs(r) + abs(s)) / 2), maxDistance);
  }

  return maxDistance;
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
