import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 22;
const lines = readInput(day, year);

type DayInputType = bigint[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((x) => BigInt(x));
}

const nextNumber = (n: bigint) => {
  let newNumber = prune(mix(n, n * 64n));
  newNumber = prune(mix(newNumber, BigInt(Math.trunc(Number(newNumber) / 32))));
  newNumber = prune(mix(newNumber, newNumber * 2048n));
  return newNumber;
};

const mix = (a: bigint, b: bigint) => {
  return a ^ b;
};

const prune = (n: bigint) => n % 16777216n;

function part1(startingNumbers: DayInputType): Solution {
  return Number(
    startingNumbers
      .map((n) => {
        let newN = n;
        for (let i = 0; i < 2000; i++) {
          newN = nextNumber(newN);
        }
        return newN;
      })
      .reduce((sum, n) => sum + n, 0n)
  );
}

function part2(startingNumbers: DayInputType): Solution {
  // TODO: Implement Part 2
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
