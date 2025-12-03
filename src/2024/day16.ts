import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 16;
const lines = readInput(day, year);

type DayInputType = {
  map: string[][];
  floodFillResult: {
    [xy: string]: number;
  };
  start: number[];
  end: number[];
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const map = Array.from(lines.map((line) => Array.from(line)));

  const [start, end] = getStartEndPositions(map);
  const floodFillResult: { [xy: string]: number } = floodFill(start, end, map);

  return { map, floodFillResult, start, end };
}

const getStartEndPositions = (map: string[][]) => {
  const startingPosition: number[] = [];
  const endPosition: number[] = [];
  map.some((row, y) =>
    row.some((cell, x) => {
      if (cell === "S") {
        startingPosition.push(x);
        startingPosition.push(y);

        if (endPosition.length > 0) return true;
      } else if (cell === "E") {
        endPosition.push(x);
        endPosition.push(y);

        if (startingPosition.length > 0) return true;
      }
      return false;
    })
  );
  return [startingPosition, endPosition];
};

const rotationCost = (prevDir: number, nextDir: number) => {
  if (prevDir === nextDir) return 0;
  if (Math.abs(prevDir - nextDir) === 2) {
    return 2000;
  }
  return 1000;
};

// east: 0, south: 1, west: 2, north: 3
const getNext = ([cost, x, y, dir]: number[], map: string[][]) => {
  const next: number[][] = [];
  if (x > 0 && map[y][x - 1] !== "#" && rotationCost(dir, 2) < 2000) {
    next.push([cost + rotationCost(dir, 2) + 1, x - 1, y, 2]);
  }
  if (y > 0 && map[y - 1][x] !== "#" && rotationCost(dir, 3) < 2000) {
    next.push([cost + rotationCost(dir, 3) + 1, x, y - 1, 3]);
  }
  if (
    x < map.length - 1 &&
    map[y][x + 1] !== "#" &&
    rotationCost(dir, 0) < 2000
  ) {
    next.push([cost + rotationCost(dir, 0) + 1, x + 1, y, 0]);
  }
  if (
    y < map.length - 1 &&
    map[y + 1][x] !== "#" &&
    rotationCost(dir, 1) < 2000
  ) {
    next.push([cost + rotationCost(dir, 1) + 1, x, y + 1, 1]);
  }

  return next;
};

const floodFill = (
  [x0, y0]: number[],
  [xend, yend]: number[],
  map: string[][]
) => {
  const visited: { [xy: string]: number } = {};

  const toDo: number[][] = [[0, x0, y0, 0]];
  let lowestCost = Infinity;

  while (toDo.length > 0) {
    const current = toDo.shift() as number[];
    // const [cost, x, y, dir] = current;

    if (current[1] === xend && current[2] === yend) {
      if (current[0] > lowestCost) continue;
      else lowestCost = current[0];
    }

    const currentString = `${current[1]},${current[2]},${current[3]}`;

    if (visited[currentString] < current[0]) continue;

    visited[currentString] = current[0];

    toDo.push(...getNext(current, map));
  }

  return visited;
};

const printMap = (map: string[][]) => {
  map.forEach((row) => {
    console.log(row.join(""));
  });
};

// east: 0, south: 1, west: 2, north: 3
const traceBackPath = (
  startString: string,
  endx: number,
  endy: number,
  floodResult: { [xy: string]: number },
  map: string[][]
) => {
  const findPositionStrings = (
    x: number,
    y: number,
    prevDir: number,
    floodFillResult: { [xy: string]: number }
  ) => {
    const options: string[] = [];
    let lowestCost = Infinity;
    Object.keys(floodFillResult).forEach((positionString) => {
      const [xs, ys, dirs] = positionString.split(",");
      if (x === parseInt(xs) && y === parseInt(ys)) {
        options.push(positionString);
        if (
          floodFillResult[positionString] +
            rotationCost(prevDir, parseInt(dirs)) <
          lowestCost
        ) {
          lowestCost =
            floodFillResult[positionString] +
            rotationCost(prevDir, parseInt(dirs));
        }
      }
    });

    return options.filter((posString) => {
      const [_x, _y, dir] = posString.split(",");

      return (
        floodFillResult[posString] + rotationCost(prevDir, parseInt(dir)) ===
        lowestCost
      );
    });
  };

  const positionStrings: string[] = [startString];

  const positionSet = new Set();
  while (positionStrings.length > 0) {
    const posString = positionStrings.pop()!;

    if (positionSet.has(posString)) continue;

    positionSet.add(posString);

    const [x, y, dir] = posString.split(",").map((x) => parseInt(x));

    if (x === endx && y === endy) continue;

    map[y][x] = "O";
    if (dir === 0) {
      const options = findPositionStrings(x - 1, y, dir, floodResult);
      positionStrings.push(...options);
    } else if (dir === 1) {
      const options = findPositionStrings(x, y - 1, dir, floodResult);
      positionStrings.push(...options);
    } else if (dir === 2) {
      const options = findPositionStrings(x + 1, y, dir, floodResult);
      positionStrings.push(...options);
    } else if (dir === 3) {
      const options = findPositionStrings(x, y + 1, dir, floodResult);
      positionStrings.push(...options);
    }
  }
};

function part1({ floodFillResult, end }: DayInputType): Solution {
  const endString = `${end[0]},${end[1]}`;
  let bestEndingCost = Infinity;
  Object.keys(floodFillResult).forEach((positionString) => {
    if (endString === positionString.slice(0, -2)) {
      if (bestEndingCost > floodFillResult[positionString]) {
        bestEndingCost = floodFillResult[positionString];
      }
    }
  });

  return bestEndingCost;
}

function part2({ map, floodFillResult, start, end }: DayInputType): Solution {
  const endString = `${end[0]},${end[1]}`;
  let bestEndingCost = Infinity;
  const bestEndStrings: string[] = [];
  Object.keys(floodFillResult).forEach((positionString) => {
    if (endString === positionString.slice(0, -2)) {
      if (bestEndingCost > floodFillResult[positionString]) {
        bestEndingCost = floodFillResult[positionString];
        bestEndStrings.push(positionString);
      }
    }
  });

  bestEndStrings.forEach((positionString) => {
    if (floodFillResult[positionString] !== bestEndingCost) return;

    traceBackPath(positionString, start[0], start[1], floodFillResult, map);
  });
  // printMap(map);

  let tiles = 0;
  map.forEach((row) =>
    row.forEach((cell) => {
      if (cell === "O" || cell === "S") tiles++;
    })
  );

  return tiles;
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
