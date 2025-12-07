import { readInput, timeIt } from "../common";
import { Direction2D } from "../lib/grid";
import { type Solution } from "../types";
import fs from "node:fs";

const year = 2024;
const day = 6;
const lines = readInput(day, year);

type DayInputType = {
  get: (x: number, y: number) => string;
  x0: number;
  y0: number;
  size: number;
};

// Returns the manipulated input lines
function setup(lines: string[]) {
  const fullMap = lines.join("");
  const size = Math.sqrt(fullMap.length);

  const start = fullMap.search(/\^/);
  const [x0, y0] = [start % size, Math.trunc(start / size)];

  const get = (x: number, y: number) => {
    return fullMap[y * size + x];
  };

  return { get, x0, y0, size };
}

const nextDir = (dir: Direction2D) => {
  if (dir === "up") return "right";
  if (dir === "right") return "down";
  if (dir === "down") return "left";
  return "up";
};

const _getMap = (
  originalMap: string,
  visited: Set<string>,
  obstacle: number[] = [-1, -1]
) => {
  const visited_indices: number[] = [];
  const size = Math.sqrt(originalMap.length);

  visited.forEach((location) => {
    const [x, y] = location.split(",").map((x) => parseInt(x));
    visited_indices.push(x + y * size);
  });
  const obstacleIndex = obstacle[0] + obstacle[1] * size;

  let map = "";
  let x = 0;
  Array.from(originalMap).forEach((location, index) => {
    if (visited_indices.includes(index)) {
      map += "X";
    } else if (index === obstacleIndex) {
      map += "O";
    } else {
      map += location;
    }
    x = (x + 1) % size;
    if (x === 0) {
      map += "\n";
    }
  });

  return map;
};

const _saveMap = (
  filename: string,
  originalMap: string,
  visited: Set<string>,
  obstacle: number[]
) => {
  fs.writeFileSync(
    filename,
    new TextEncoder().encode(_getMap(originalMap, visited, obstacle))
  );
};

const _printMap = (originalMap: string, visited: Set<string>) => {
  console.log(_getMap(originalMap, visited));
};

const findPath = (
  startX: number,
  startY: number,
  direction: Direction2D,
  get: (x: number, y: number) => string,
  size: number,
  obstacleLocation: number[] = []
) => {
  const visitedUnique: Set<string> = new Set();
  const path: string[] = [];

  let currentDir = direction;
  let [x, y] = [startX, startY];

  let placeObstacle = false;
  if (obstacleLocation.length !== 0) {
    placeObstacle = true;
  }

  // Find gard path
  while (x >= 0 && x < size && y >= 0 && y < size) {
    const locationDir = `${x},${y},${currentDir}`;

    if (path.includes(locationDir)) {
      return {
        loop: true,
        path: path,
        visitedUnique: visitedUnique,
      };
    }

    visitedUnique.add(`${x},${y}`);
    path.push(locationDir);

    let deltaX = 0,
      deltaY = 0;
    if (currentDir === "up") deltaY = -1;
    else if (currentDir === "right") deltaX = 1;
    else if (currentDir === "down") deltaY = 1;
    else if (currentDir === "left") deltaX = -1;

    if (
      (x + deltaX < size && get(x + deltaX, y + deltaY) === "#") ||
      (placeObstacle &&
        x + deltaX === obstacleLocation[0] &&
        y + deltaY === obstacleLocation[1])
    ) {
      currentDir = nextDir(currentDir);
      deltaX = 0;
      deltaY = 0;
    }

    x += deltaX;
    y += deltaY;
  }

  return {
    loop: false,
    path: path,
    visitedUnique: visitedUnique,
  };
};

function part1({ get, x0, y0, size }: DayInputType): Solution {
  const result = findPath(x0, y0, "up", get, size);
  return result.visitedUnique.size;
}

const findObstacles = (
  path: string[],
  x0: number,
  y0: number,
  get: (x: number, y: number) => string,
  size: number
) => {
  // let numberOfLoops = 0;
  const obstacles: Set<string> = new Set();
  const visited: Set<string> = new Set();

  path.forEach((location, index, arr) => {
    const [obstacleX, obstacleY, _] = location.split(",");
    const obstacleString = `${obstacleX},${obstacleY}`;

    if (
      visited.has(obstacleString) ||
      (parseInt(obstacleX) == x0 && parseInt(obstacleY) == y0)
    ) {
      return;
    }
    visited.add(obstacleString);

    const [x, y, dir] = arr[index - 1].split(",");

    const result = findPath(
      parseInt(x),
      parseInt(y),
      dir as Direction2D,
      get,
      size,
      [parseInt(obstacleX), parseInt(obstacleY)]
    );
    if (result.loop) {
      // numberOfLoops++;
      // console.log(
      //   `(${
      //     (index * 100 / arr.length).toFixed(1)
      //   }%) Found ${numberOfLoops} loops: latest obstacle location -> (${obstacleX}, ${obstacleY})`,
      // );
      obstacles.add(obstacleString);
      // saveMap(`./out/${numberOfLoops}.txt`, result.visitedUnique, [
      //   parseInt(obstacleX),
      //   parseInt(obstacleY),
      // ]);
      // console.log(result.path);
      // console.log(result.visitedUnique);
    }
  });

  return obstacles;
};

function part2({ get, x0, y0, size }: DayInputType): Solution {
  const result = findPath(x0, y0, "up", get, size);
  return findObstacles(result.path, x0, y0, get, size).size;
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
