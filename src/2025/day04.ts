import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 4;
const lines = readInput(day, year);

type DayInputType = string[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) => Array.from(line));
}

function part1(map: DayInputType): Solution {
  let freeRolls = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === ".") continue;

      let rolls = 0;
      if (x > 0) {
        if (map[y][x - 1] === "@") rolls++;
        if (y > 0 && map[y - 1][x - 1] === "@") rolls++;
        if (y < map.length - 1 && map[y + 1][x - 1] === "@") rolls++;
      }
      if (x < map[y].length - 1) {
        if (map[y][x + 1] === "@") rolls++;
        if (y > 0 && map[y - 1][x + 1] === "@") rolls++;
        if (y < map.length - 1 && map[y + 1][x + 1] === "@") rolls++;
      }
      if (y > 0 && map[y - 1][x] === "@") rolls++;
      if (y < map.length - 1 && map[y + 1][x] === "@") rolls++;

      if (rolls < 4) freeRolls++;
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
        if (map[y][x] === ".") continue;

        let rolls = 0;
        if (x > 0) {
          if (map[y][x - 1] === "@") rolls++;
          if (y > 0 && map[y - 1][x - 1] === "@") rolls++;
          if (y < map.length - 1 && map[y + 1][x - 1] === "@") rolls++;
        }
        if (x < map[y].length - 1) {
          if (map[y][x + 1] === "@") rolls++;
          if (y > 0 && map[y - 1][x + 1] === "@") rolls++;
          if (y < map.length - 1 && map[y + 1][x + 1] === "@") rolls++;
        }
        if (y > 0 && map[y - 1][x] === "@") rolls++;
        if (y < map.length - 1 && map[y + 1][x] === "@") rolls++;

        if (rolls < 4) {
          freeRolls++;
          removedRolls = true;
          map[y][x] = ".";
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
