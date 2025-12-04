import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 4;
const lines = readInput(day, year);

type DayInputType = number[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) => Array.from(line).map((c) => (c === "@" ? 1 : 0)));
}

const kernel: { [y: number]: { [x: number]: number } } = {
  "-1": { "-1": 1, 0: 1, 1: 1 },
  "0": { "-1": 1, 0: 0, 1: 1 },
  "1": { "-1": 1, 0: 1, 1: 1 },
};

const neighbors1D = [-1, 0, +1];

const applyKernel = (
  map: number[][],
  x: number,
  y: number,
  kernel: { [y: number]: { [x: number]: number } }
) => {
  let sum = 0;
  for (const i of neighbors1D)
    for (const j of neighbors1D) {
      if (map[y + j] === undefined || map[y + j][x + i] === undefined) continue;
      sum += map[y + j][x + i] * kernel[j][i];
    }

  return sum;
};

function part1(map: DayInputType): Solution {
  let freeRolls = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 1 && applyKernel(map, x, y, kernel) < 4) freeRolls++;
    }
  }

  return freeRolls;
}

function part2(map: DayInputType): Solution {
  let freeRolls = 0;
  let removedRolls = true;

  while (removedRolls) {
    removedRolls = false;
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === 0) {
          continue;
        }
        if (applyKernel(map, x, y, kernel) < 4) {
          map[y][x] = 0;
          freeRolls++;
          removedRolls = true;
        }
      }
    }
  }

  return freeRolls;
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
