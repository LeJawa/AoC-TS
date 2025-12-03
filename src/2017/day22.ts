import { readInput, timeIt } from "../common";
import { Direction2D } from "../lib/grid";
import { type Solution } from "../types";

const year = 2017;
const day = 22;
const lines = readInput(day, year);

type DayInputType = string[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((row) => row.split(""));
}

const turnRightMap: { [d in Direction2D]: Direction2D } = {
  up: "right",
  left: "up",
  down: "left",
  right: "down",
};
const turnLeftMap: { [d in Direction2D]: Direction2D } = {
  up: "left",
  left: "down",
  down: "right",
  right: "up",
};
const turnBackMap: { [d in Direction2D]: Direction2D } = {
  up: "down",
  left: "right",
  down: "up",
  right: "left",
};

const setupGrid = (gridArray: DayInputType) => {
  const grid: { [x: number]: { [y: number]: string } } = {};

  gridArray.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (grid[x] === undefined) grid[x] = {};

      grid[x][y] = cell;
    });
  });

  return grid;
};

function part1(gridArray: DayInputType): Solution {
  let infectionCount = 0;
  const grid = setupGrid(gridArray);
  let x = Math.floor(gridArray.length / 2);
  let y = x;
  let direction: Direction2D = "up";

  for (let i = 0; i < 10000; i++) {
    if (!!grid[x] && grid[x][y] === "#") {
      direction = turnRightMap[direction];
      grid[x][y] = ".";
    } else {
      direction = turnLeftMap[direction];
      if (grid[x] === undefined) grid[x] = {};
      grid[x][y] = "#";
      infectionCount++;
    }

    switch (direction) {
      case "up":
        y--;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
        break;
      case "right":
        x++;
        break;
    }
  }
  return infectionCount;
}

function part2(gridArray: DayInputType): Solution {
  let infectionCount = 0;
  const grid = setupGrid(gridArray);
  let x = Math.floor(gridArray.length / 2);
  let y = x;
  let direction: Direction2D = "up";

  for (let i = 0; i < 10000000; i++) {
    if (
      grid[x] === undefined ||
      grid[x][y] === undefined ||
      grid[x][y] === "."
    ) {
      direction = turnLeftMap[direction];
      if (grid[x] === undefined) grid[x] = {};
      grid[x][y] = "W";
    } else if (grid[x][y] === "W") {
      grid[x][y] = "#";
      infectionCount++;
    } else if (grid[x][y] === "#") {
      direction = turnRightMap[direction];
      grid[x][y] = "F";
    } else if (grid[x][y] === "F") {
      direction = turnBackMap[direction];
      grid[x][y] = ".";
    }

    switch (direction) {
      case "up":
        y--;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
        break;
      case "right":
        x++;
        break;
    }
  }
  return infectionCount;
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
