import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 18;
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
  let lastFreq = 0;
  let index = 0;
  const registers: { [r: string]: number } = {};

  while (true) {
    const [cmd, register, value] = instructions[index];
    if (cmd == "snd") {
      lastFreq = registers[register];
    } else if (cmd == "set") {
      registers[register] = Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "add") {
      registers[register] += Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "mul") {
      registers[register] *= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "mod") {
      registers[register] %= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "rcv" && registers[register] != 0) {
      break;
    } else if (cmd == "jgz" && registers[register] > 0) {
      index += Number.isInteger(value) ? (value as number) : registers[value];
      continue;
    }

    index++;
  }

  return lastFreq;
}

function part2(instructions: DayInputType): Solution {
  let timesSent = 0;

  let index0 = 0;
  let index1 = 0;
  const registers0: { [r: string]: number } = { p: 0 };
  const registers1: { [r: string]: number } = { p: 1 };

  const queue0: number[] = [];
  const queue1: number[] = [];

  const handleInstruction = (
    index: number,
    program: number,
    registers: { [r: string]: number }
  ) => {
    let queue: typeof queue0;
    let otherQueue: typeof queue0;
    if (program === 0) {
      queue = queue0;
      otherQueue = queue1;
    } else {
      queue = queue1;
      otherQueue = queue0;
    }

    const [cmd, register, value] = instructions[index];
    let offset = 1;
    if (cmd == "set") {
      registers[register] = Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "add") {
      registers[register] += Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "mul") {
      registers[register] *= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "mod") {
      registers[register] %= Number.isInteger(value)
        ? (value as number)
        : registers[value];
    } else if (cmd == "jgz") {
      const compareValue = Number.isInteger(register)
        ? (register as number)
        : registers[register];
      if (compareValue > 0)
        offset = Number.isInteger(value) ? (value as number) : registers[value];
    } else if (cmd == "snd") {
      const value = Number.isInteger(register)
        ? (register as number)
        : registers[register];

      if (program === 0) queue1.push(value);
      else {
        queue0.push(value);
        timesSent++;
      }
    } else if (cmd === "rcv") {
      const value = queue.shift();
      if (value === undefined) {
        offset = 0;
      } else {
        registers[register] = value;
      }
    }

    if (program == 0) index0 += offset;
    else index1 += offset;
  };

  while (true) {
    const prevIndex0 = index0;
    const prevIndex1 = index1;

    handleInstruction(index0, 0, registers0);
    handleInstruction(index1, 1, registers1);

    if (prevIndex0 === index0 && prevIndex1 === index1) {
      break;
    }

    if (index0 < 0 || index0 >= instructions.length) {
      index0 = -1;
    }
    if (index1 < 0 || index1 >= instructions.length) {
      index1 = -1;
    }
  }

  return timesSent;
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
