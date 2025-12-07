import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 23;
const lines = readInput(day, year);

type DayInputType = (string | number)[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines
    .map((line) => line.split(" "))
    .map(([cmd, register, value]) => [
      cmd,
      Number.isNaN(parseInt(register)) ? register : parseInt(register),
      Number.isNaN(parseInt(value)) ? value : parseInt(value),
    ]);
}

function part1(instructions: DayInputType): Solution {
  let mulCount = 0;
  let index = 0;
  const registers: { [r: string]: number } = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
  };

  while (index >= 0 && index < instructions.length) {
    const [cmd, register, value] = instructions[index];
    if (cmd == "set") {
      registers[register] = Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "sub") {
      registers[register] -= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "mul") {
      registers[register] *= Number.isInteger(value)
        ? (value as number)
        : registers[value];
      mulCount++;
    } else if (cmd == "jnz" && registers[register] != 0) {
      index += Number.isInteger(value) ? (value as number) : registers[value];
      continue;
    }

    index++;
  }

  return mulCount;
}

function part2(instructions: DayInputType): Solution {
  let index = 0;
  const registers: { [r: string]: number } = {
    a: 1,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
  };

  // Run instructions until b and c are set
  while (index >= 0 && index < instructions.length) {
    const [cmd, register, value] = instructions[index];

    if (index + 1 === 9) break;
    if (cmd == "set") {
      registers[register] = Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "sub") {
      registers[register] -= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "mul") {
      registers[register] *= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "jnz" && registers[register] != 0) {
      index += Number.isInteger(value) ? (value as number) : registers[value];
      continue;
    }

    index++;
  }

  // Register h becomes the amount of integers between b and c (with a step of 17)
  // that are not prime.
  let h = 0;
  for (let n = registers.b; n <= registers.c; n += 17) {
    const max = Math.sqrt(n);
    if (n % 2 === 0 || n % 3 === 0 || n % 5 === 0) {
      h++;
      continue;
    }
    for (let i = 7; i < max; i++) {
      if (i % 2 === 0 || i % 3 === 0 || i % 5 === 0) continue;
      if (n % i === 0) {
        h++;
        break;
      }
    }
  }

  return h;
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
