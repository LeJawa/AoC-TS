import { readInput, timeIt } from "../common";
import { Direction2D } from "../lib/grid";
import { type Solution } from "../types";

const year = 2017;
const day = 19;
const lines = readInput(day, year);

type DayInputType = { path: string; steps: number };

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const maxWidth = lines.reduce((max, line) => Math.max(max, line.length), 0);
  const grid = lines.map((line) => line.padEnd(maxWidth, " "));

  return runPath(grid[0].indexOf("|"), grid);
}

const runPath = (x0: number, grid: string[]) => {
  const path: string[] = [];

  let x = x0;
  let y = 1;
  let steps = 1;

  let direction: Direction2D = "d";

  while (true) {
    const char = grid[y][x];
    if (char === " ") break;

    switch (direction) {
      case "d":
        if (char !== "+") {
          if (char !== "|" && char !== "-") path.push(char);
        } else {
          if (grid[y][x - 1] === " ") {
            direction = "r";
          } else {
            direction = "l";
          }
        }
        break;
      case "u":
        if (char !== "+") {
          if (char !== "|" && char !== "-") path.push(char);
        } else {
          if (grid[y][x - 1] === " ") {
            direction = "r";
          } else {
            direction = "l";
          }
        }
        break;
      case "l":
        if (char !== "+") {
          if (char !== "|" && char !== "-") path.push(char);
        } else {
          if (grid[y - 1][x] === " ") {
            direction = "d";
          } else {
            direction = "u";
          }
        }
        break;
      case "r":
        if (char !== "+") {
          if (char !== "|" && char !== "-") path.push(char);
        } else {
          if (grid[y - 1][x] === " ") {
            direction = "d";
          } else {
            direction = "u";
          }
        }
        break;
    }

    switch (direction) {
      case "d":
        y++;
        break;
      case "u":
        y--;
        break;
      case "l":
        x--;
        break;
      case "r":
        x++;
        break;
    }

    steps++;
  }

  return { path: path.join(""), steps };
};

function part1({ path }: DayInputType): Solution {
  return path;
}

function part2({ steps }: DayInputType): Solution {
  return steps;
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
