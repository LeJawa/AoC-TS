import { readInput, timeIt } from "../common";
import { max } from "../lib/math";
import { type Solution } from "../types";

const year = 2017;
const day = 3;
const lines = readInput(day, year);

type DayInputType = number;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return parseInt(lines[0]);
}

const closestSmallerSquare = (target: number) => {
  let square = 1;
  while (square ** 2 < target) {
    square += 2;
  }
  return square - 2;
};

const abs = Math.abs;

function part1(target: DayInputType): Solution {
  let square = closestSmallerSquare(target);
  const diff = target - square ** 2;

  const remainder = (diff % (square + 1)) - Math.floor((square + 2) / 2);

  return Math.floor(square / 2) + 1 + abs(remainder);
}

const numberFromCoords = (x: number, y: number) => {
  if (x === 0 && y === 0) return 1;

  const ringIndex = max(abs(x), abs(y));
  const ringStart = (ringIndex * 2 - 1) ** 2 + 1;

  const x0 = ringIndex;
  const y0 = -(ringIndex - 1);

  if (x0 === x && y0 === y) return ringStart;

  let newX = x0,
    newY = y0,
    value = ringStart;

  // Find the current coord going around the ring
  // up
  while (newY < ringIndex) {
    newY += 1;
    value += 1;
    if (newX === x && newY === y) return value;
  }
  // left
  while (newX > -ringIndex) {
    newX -= 1;
    value += 1;
    if (newX === x && newY === y) return value;
  }
  // down
  while (newY > -ringIndex) {
    newY -= 1;
    value += 1;
    if (newX === x && newY === y) return value;
  }
  // left
  while (newX < ringIndex) {
    newX += 1;
    value += 1;
    if (newX === x && newY === y) return value;
  }

  return undefined!;
};

const coordsFromNumber = (target: number): [number, number] => {
  if (target === 1) return [0, 0];

  const square = closestSmallerSquare(target);
  const diff = target - square ** 2;

  const remainder = diff % (square + 1);
  const side = Math.floor(diff / (square + 1));

  const factor = Math.floor(square / 2) + 1;

  switch (side) {
    case 0:
      return [factor, -factor + remainder];
    case 1:
      return [factor - remainder, factor];
    case 2:
      return [-factor, factor - remainder];
    case 3:
      return [-factor + remainder, -factor];
    case 4:
      return [factor, -factor];
  }

  return undefined!;
};

const addToNeighbours = (
  x: number,
  y: number,
  value: number,
  valueDict: { [n: number]: number }
) => {
  for (const i of [-1, 0, 1])
    for (const j of [-1, 0, 1]) {
      if (i === 0 && j === 0) continue;

      const n = numberFromCoords(x + i, y + j);
      if (n > value) {
        if (valueDict[n] === undefined) valueDict[n] = 0;

        valueDict[n] += valueDict[value];
      }
    }
};

function part2(target: DayInputType): Solution {
  const valueDict: { [n: number]: number } = { 1: 1 };
  let result: number = undefined!;

  for (let n = 1; n < target; n++) {
    const [x, y] = coordsFromNumber(n);
    addToNeighbours(x, y, n, valueDict);

    if (valueDict[n] > target) {
      result = valueDict[n];
      break;
    }
  }

  return result;
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
