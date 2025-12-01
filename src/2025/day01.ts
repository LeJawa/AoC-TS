import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 1;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

function part1(rotations: DayInputType): Solution {
  let pos = 50;
  let zeroCount = 0;

  for (const rotation of rotations) {
    const dir = rotation[0];
    const rawAmount = parseInt(rotation.slice(1));

    const amount = dir === "R" ? rawAmount : -rawAmount;

    pos = (pos + amount) % 100;
    if (pos === 0) zeroCount++;
  }

  return zeroCount;
}

function part2(rotations: DayInputType): Solution {
  let pos = 50;
  let zeroCount = 0;

  for (const rotation of rotations) {
    const dir = rotation[0];
    const rawAmount = parseInt(rotation.slice(1));

    let midAmount = rawAmount;
    while (midAmount > 100) {
      midAmount -= 100;
      zeroCount++;
    }

    const amount = dir === "R" ? midAmount : -midAmount;

    if (amount < 0 && amount < -pos && pos !== 0) {
      zeroCount++;
    }
    if (amount > 0 && amount + pos > 100 && pos !== 0) {
      zeroCount++;
    }

    pos = (pos + amount) % 100;
    if (pos < 0) pos += 100;
    if (pos === 0) zeroCount++;
  }

  return zeroCount;
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
