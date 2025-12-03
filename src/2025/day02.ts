import { readInput, timeIt } from "../common";
import { max, min } from "../lib/math";
import { type Solution } from "../types";

const year = 2025;
const day = 2;
const lines = readInput(day, year);

type DayInputType = [string, string][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const ranges = lines[0]
    .split(",")
    .map((range) => range.split("-") as [string, string]);
  return ranges;
}

function part1(ranges: DayInputType): Solution {
  const factorMap: { [length: number]: number } = {
    2: 11,
    4: 101,
    6: 1001,
    8: 10001,
    10: 100001,
  };

  let invalidIdSum = 0;

  for (const range of ranges) {
    if (range[0].length === range[1].length && range[0].length % 2 === 1)
      continue;

    let r0: number;
    if (range[0].length % 2 === 1) r0 = Math.pow(10, range[0].length);
    else r0 = parseInt(range[0]);

    let r1: number;
    if (range[1].length % 2 === 1) r1 = Math.pow(10, range[1].length - 1) - 1;
    else r1 = parseInt(range[1]);

    const factor = factorMap[r0.toString().length];
    let seed = Math.ceil(r0 / factor);
    let nextNumber = seed * factor;
    while (nextNumber <= r1) {
      invalidIdSum += nextNumber;
      seed++;
      nextNumber = seed * factor;
    }
  }

  return invalidIdSum;
}

function part2(ranges: DayInputType): Solution {
  const factorMap: { [length: number]: number[] } = {
    1: [],
    2: [11],
    3: [111],
    4: [101],
    5: [11111],
    6: [1001, 10101],
    7: [1111111],
    8: [10001],
    9: [111111111, 1001001],
    10: [100001, 101010101],
  };
  let invalidIdSum = 0;

  for (const range of ranges) {
    const range0 = parseInt(range[0]);
    const range1 = parseInt(range[1]);

    const numbersToSkip: number[] = [];

    let r0: number;
    if (range[0].length % 2 === 1 && range[1].length > range[0].length) {
      // Handle numbers until r0
      const factor = factorMap[range[0].length][0];
      r0 = min(Math.pow(10, range[0].length), range1);
      if (factor !== undefined) {
        // not 1 digit case
        let seed = Math.ceil(range0 / factor);
        let nextNumber = seed * factor;
        while (nextNumber <= r0) {
          invalidIdSum += nextNumber;
          numbersToSkip.push(nextNumber);
          seed++;
          nextNumber = seed * factor;
        }
      }
    } else r0 = parseInt(range[0]);

    let r1: number;
    if (range[1].length % 2 === 1 && range[1].length > range[0].length) {
      // Handle numbers from r1 until range1
      const factor = factorMap[range[1].length][0];
      r1 = max(Math.pow(10, range[1].length - 1) - 1, range0);
      if (factor !== undefined) {
        // not 1 digit case
        let seed = Math.ceil(r1 / factor);
        let nextNumber = seed * factor;
        while (nextNumber <= range1) {
          invalidIdSum += nextNumber;
          numbersToSkip.push(nextNumber);
          seed++;
          nextNumber = seed * factor;
        }
      }
    } else r1 = parseInt(range[1]);

    let factors = factorMap[r0.toString().length];

    factors.forEach((factor, i) => {
      let seed = Math.ceil(r0 / factor);
      let nextNumber = seed * factor;
      while (nextNumber <= r1) {
        if (i === 1 && nextNumber % factors[0] === 0) {
          seed++;
          nextNumber = seed * factor;
          continue;
        }
        invalidIdSum += nextNumber;
        seed++;
        nextNumber = seed * factor;
      }
    });
  }
  return invalidIdSum;
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
