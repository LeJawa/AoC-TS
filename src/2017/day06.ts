import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 6;
const lines = readInput(day, year);

type DayInputType = () => number[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const line = lines[0];

  const getMemory = () => line.split(/\W+/).map((x) => parseInt(x));
  return getMemory;
}

function part1(getMemory: DayInputType): Solution {
  const memory = getMemory();
  const size = memory.length;
  const configurations = new Set<string>();
  let memoryString = memory.toString();

  while (!configurations.has(memoryString)) {
    configurations.add(memoryString);

    let maxN = -1;
    let index = 0;
    memory.forEach((n, i) => {
      if (n > maxN) {
        maxN = n;
        index = i;
      }
    });

    memory[index] = 0;
    const part = Math.floor(maxN / size);

    for (let i = 0; i < memory.length; i++) {
      memory[i] += part;
    }

    const remainder = maxN % size;
    for (let i = 1; i < remainder + 1; i++) {
      memory[(index + i) % size] += 1;
    }

    memoryString = memory.toString();
  }

  return configurations.size;
}

function part2(getMemory: DayInputType): Solution {
  const memory = getMemory();
  const size = memory.length;
  const configurations = new Set<string>();
  const memoryIndex: { [s: string]: number } = {};
  let memoryString = memory.toString();
  let step = 0;

  while (!configurations.has(memoryString)) {
    configurations.add(memoryString);
    memoryIndex[memoryString] = step;

    let maxN = -1;
    let index = 0;
    memory.forEach((n, i) => {
      if (n > maxN) {
        maxN = n;
        index = i;
      }
    });

    memory[index] = 0;
    const part = Math.floor(maxN / size);

    for (let i = 0; i < memory.length; i++) {
      memory[i] += part;
    }

    const remainder = maxN % size;
    for (let i = 1; i < remainder + 1; i++) {
      memory[(index + i) % size] += 1;
    }

    memoryString = memory.toString();
    step++;
  }

  return step - memoryIndex[memoryString];
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
