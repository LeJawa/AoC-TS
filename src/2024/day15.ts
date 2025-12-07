import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 15;
const lines = readInput(day, year);

type DayInputType = {
  map: string[][];
  secondMap: string[][];
  instructions: string[];
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const map = Array.from(
    lines.filter((line) => line[0] === "#").map((line) => Array.from(line))
  );

  const secondMap = Array.from(
    lines
      .filter((line) => line[0] === "#")
      .map((line) =>
        Array.from(Array.from(line).map(secondWarehouseConverter).join(""))
      )
  );

  const instructions = Array.from(
    lines.filter((line) => line[0] !== "#" && line.length !== 0).join("")
  );

  return { map, secondMap, instructions };
}

const secondWarehouseConverter = (char: string) => {
  if (char === ".") return "..";
  if (char === "#") return "##";
  if (char === "O") return "[]";
  if (char === "@") return "@.";
  return "";
};

const getStartingPosition = (map: string[][]) => {
  const startingPosition: number[] = [];
  map.some((row, y) =>
    row.some((cell, x) => {
      if (cell === "@") {
        startingPosition.push(x);
        startingPosition.push(y);
        return true;
      }
      return false;
    })
  );
  return startingPosition;
};

const _printMap = (map: string[][]) => {
  map.forEach((row) => {
    console.log(row.join(""));
  });
};

type Direction = ">" | "<" | "v" | "^";

const checkNextPosPart1 = (
  [x, y]: number[],
  dir: number[],
  map: string[][]
) => {
  if (map[y + dir[1]][x + dir[0]] === "#") return false;

  if (
    map[y + dir[1]][x + dir[0]] === "." ||
    checkNextPosPart1([x + dir[0], y + dir[1]], dir, map)
  ) {
    return true;
  }
  return false;
};

const moveRobotPart1 = (
  [xr, yr]: number[],
  instruction: Direction,
  map: string[][]
) => {
  let dir: number[];
  if (instruction === ">") dir = [1, 0];
  else if (instruction === "<") dir = [-1, 0];
  else if (instruction === "^") dir = [0, -1];
  else dir = [0, 1];

  if (checkNextPosPart1([xr, yr], dir, map)) {
    propagateMovement([xr, yr], dir, map);
    return [xr + dir[0], yr + dir[1]];
  } else {
    return [xr, yr];
  }
};

const propagateMovement = (
  [x, y]: number[],
  dir: number[],
  map: string[][]
) => {
  if (dir[1] === 0) horizontalMovement([x, y], dir, map);
  else verticalMovement([x, y], dir, map);
};

const horizontalMovement = (
  [x, y]: number[],
  dir: number[],
  map: string[][]
) => {
  if (map[y + dir[1]][x + dir[0]] !== ".") {
    horizontalMovement([x + dir[0], y + dir[1]], dir, map);
  }

  map[y + dir[1]][x + dir[0]] = map[y][x];
  map[y][x] = ".";
};

const verticalMovement = ([x, y]: number[], dir: number[], map: string[][]) => {
  const nextCell = map[y + dir[1]][x + dir[0]];
  if (nextCell !== ".") {
    verticalMovement([x + dir[0], y + dir[1]], dir, map);
    if (nextCell === "[") {
      verticalMovement([x + dir[0] + 1, y + dir[1]], dir, map);
    } else if (nextCell === "]") {
      verticalMovement([x + dir[0] - 1, y + dir[1]], dir, map);
    }
  }

  map[y + dir[1]][x + dir[0]] = map[y][x];
  map[y][x] = ".";
};

const getGPSSum = (map: string[][]) => {
  let gpsSum = 0;

  map.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell === "O" || cell === "[") {
        gpsSum += y * 100 + x;
      }
    })
  );
  return gpsSum;
};

function part1({ map, instructions }: DayInputType): Solution {
  // printMap(map);
  let robotPosition = getStartingPosition(map);
  instructions.forEach((inst) => {
    // console.log(inst);
    robotPosition = moveRobotPart1(robotPosition, inst as Direction, map);
    // printMap(map);
  });

  const gpsSum = getGPSSum(map);
  return gpsSum;
}

const checkNextPosPart2 = (
  [x, y]: number[],
  dir: number[],
  map: string[][]
): boolean => {
  const nextCell = map[y + dir[1]][x + dir[0]];
  if (nextCell === "#") return false;
  const checkNext = checkNextPosPart2([x + dir[0], y + dir[1]], dir, map);
  if (nextCell === "." || (dir[1] === 0 && checkNext)) return true;
  if (nextCell === "[") {
    return checkNext && checkNextPosPart2([x + 1, y + dir[1]], dir, map);
  }
  if (nextCell === "]") {
    return checkNext && checkNextPosPart2([x - 1, y + dir[1]], dir, map);
  }
  return false;
};

const moveRobotPart2 = (
  [xr, yr]: number[],
  instruction: Direction,
  map: string[][]
) => {
  let dir: number[];
  if (instruction === ">") dir = [1, 0];
  else if (instruction === "<") dir = [-1, 0];
  else if (instruction === "^") dir = [0, -1];
  else dir = [0, 1];

  if (checkNextPosPart2([xr, yr], dir, map)) {
    propagateMovement([xr, yr], dir, map);
    return [xr + dir[0], yr + dir[1]];
  } else {
    return [xr, yr];
  }
};

function part2({ secondMap: map, instructions }: DayInputType): Solution {
  // printMap(map);
  let robotPosition = getStartingPosition(map);
  let step = 1;
  instructions.forEach((inst) => {
    // console.log(step, inst);
    robotPosition = moveRobotPart2(robotPosition, inst as Direction, map);
    // printMap(map);
    step++;
  });
  const gpsSum = getGPSSum(map);
  return gpsSum;
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
