import { writeFileSync } from "fs";
import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 14;
const lines = readInput(day, year);

type DayInputType = string;

const getInitialRobots = (file: string) => {
  return Array.from(file.matchAll(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g)).map(
    ([_, x, y, vx, vy]) => [
      parseInt(x),
      parseInt(y),
      parseInt(vx),
      parseInt(vy),
    ]
  );
};

const xSize = 101;
const xMiddle = Math.floor(xSize / 2);
const ySize = 103;
const yMiddle = Math.floor(ySize / 2);

const getQuadrants = (robots: number[][]) => {
  const quadrants = [0, 0, 0, 0];

  robots.forEach(([x, y, _vx, _vy]) => {
    if (x < xMiddle && y < yMiddle) quadrants[0] += 1;
    else if (x < xMiddle && y > yMiddle) quadrants[1] += 1;
    else if (x > xMiddle && y < yMiddle) quadrants[2] += 1;
    else if (x > xMiddle && y > yMiddle) quadrants[3] += 1;
  });

  return quadrants;
};

const _printMap = (robots: number[][]) => {
  const map = getMap(robots);
  map.forEach((line) => console.log(line));
};

const _saveMap = (filename: string, robots: number[][]) => {
  const map = getMap(robots);
  writeFileSync(filename, new TextEncoder().encode(map.join("\n")));
};

const getMap = (robots: number[][]) => {
  const robotMap: { [key: string]: number } = {};
  const map: string[] = [];
  robots.forEach(([x, y]) => {
    const label = `${x},${y}`;
    if (robotMap[label] === undefined) robotMap[label] = 1;
    else robotMap[label] += 1;
  });

  for (let y = 0; y < ySize; y++) {
    let line = "";
    for (let x = 0; x < xSize; x++) {
      const label = `${x},${y}`;
      if (robotMap[label] === undefined) line += ".";
      else line += "#";
    }
    map.push(line);
  }
  return map;
};

const moveNSeconds = (robots: number[][], seconds: number) => {
  robots.forEach(([x, y, vx, vy], i, arr) => {
    let xDelta = vx * seconds;
    let yDelta = vy * seconds;

    while (x + xDelta < 0) xDelta += xSize;
    while (y + yDelta < 0) yDelta += ySize;

    arr[i][0] = (x + xDelta) % xSize;
    arr[i][1] = (y + yDelta) % ySize;
  });
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.join("\n");
}

function part1(file: DayInputType): Solution {
  const robots = getInitialRobots(file);
  moveNSeconds(robots, 100);
  const quadrants = getQuadrants(robots);
  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3];
}

const robotDistance = (robots: number[][]) => {
  let distanceSum = 0;
  let amount = 0;

  const robotSubset = robots.length / 10;

  for (let i = 0; i < robotSubset - 1; i++) {
    const [xi, yi] = robots[i];
    for (let j = i + 1; j < robotSubset; j++) {
      const [xj, yj] = robots[j];
      distanceSum += Math.abs(xj - xi + yj - yi);
      amount++;
    }
  }
  return distanceSum / amount;
};

function part2(file: DayInputType): Solution {
  const robots = getInitialRobots(file);
  let seconds = 0;
  const averageDistances: number[] = [];
  while (seconds < 10000) {
    moveNSeconds(robots, 1);

    const averageDistance = robotDistance(robots);
    averageDistances.push(averageDistance);
    seconds++;
  }

  const treeIndex = averageDistances
    .map((x, i) => [i + 1, x])
    .sort((a, b) => a[1] - b[1])[0][0];
  return treeIndex;
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
