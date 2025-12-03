import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 10;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

const trailSearch = (x0: number, y0: number, map: string[]) => {
  const queue = [];
  queue.push([x0, y0]);

  const trails: string[] = [];

  while (queue.length > 0) {
    const [x, y] = queue.pop()!;

    const height = parseInt(map[y][x]);

    if (height === 9) {
      trails.push(`${x},${y}`);
      continue;
    }

    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([i, j]) => {
      if (
        x + i < 0 ||
        x + i > map[y].length - 1 ||
        y + j < 0 ||
        y + j > map.length - 1
      )
        return;

      if (parseInt(map[y + j][x + i]) == height + 1) {
        queue.push([x + i, y + j]);
      }
    });
  }

  return trails;
};

function part1(map: DayInputType): Solution {
  let trailSum = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((c, x) => {
      if (c === "0") {
        const trails = trailSearch(x, y, map);
        trailSum += new Set(trails).size;
      }
    });
  });

  return trailSum;
}

function part2(map: DayInputType): Solution {
  let trailSum = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((c, x) => {
      if (c === "0") {
        const trails = trailSearch(x, y, map);
        trailSum += trails.length;
      }
    });
  });

  return trailSum;
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
