import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 15;
const lines = readInput(day, year);

type DayInputType = { A: number; B: number };

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return { A: parseInt(lines[0].slice(-3)), B: parseInt(lines[1].slice(-3)) };
}

const ka = 16807;
const kb = 48271;

const max = 2147483647;

const next = (prev: number, k: number) => (prev * k) % max;

function part1({ A, B }: DayInputType): Solution {
  let a = A;
  let b = B;

  let count = 0;
  let rounds = 0;

  while (rounds < 40e6) {
    // if (rounds % 4e6 === 0) console.log(`. (${count})`);
    a = next(a, ka);
    b = next(b, kb);

    if ((a & 0xffff) == (b & 0xffff)) count++;

    rounds++;
  }

  return count;
}
function part2({ A, B }: DayInputType): Solution {
  let a = A;
  let b = B;

  let count = 0;
  let rounds = 0;

  while (rounds < 5e6) {
    // if (rounds % 5e5 === 0) console.log(`. (${count})`);
    a = next(a, ka);
    while (a % 4 != 0) {
      a = next(a, ka);
    }
    b = next(b, kb);
    while (b % 8 != 0) {
      b = next(b, kb);
    }

    if ((a & 0xffff) == (b & 0xffff)) count++;

    rounds++;
  }

  return count;
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
