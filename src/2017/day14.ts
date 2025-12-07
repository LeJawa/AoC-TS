import { readInput, timeIt } from "../common";
import { type Solution } from "../types";
import { knotHash } from "./day10";

const year = 2017;
const day = 14;
const lines = readInput(day, year);

type DayInputType = () => string[];

const fromHex2Bin = (s: string) => {
  let bin = "";
  let i = s.length - 8;

  while (i >= 0) {
    const subHex = s.slice(i, i + 8);
    const subBin = parseInt(subHex, 16).toString(2);

    bin = subBin.padStart(subHex.length * 4, "0") + bin;
    i -= 8;
  }

  return bin;
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const input = lines[0];
  return () => {
    const disk: string[] = [];
    for (let i = 0; i < 128; i++) {
      const hash = knotHash(`${input}-${i}`);
      disk.push(fromHex2Bin(hash));
    }
    return disk;
  };
}

function part1(getDisk: DayInputType): Solution {
  let totalUsed = 0;
  const disk = getDisk();

  for (const row of disk) {
    totalUsed += row.replace(/0/g, "").length;
  }
  return totalUsed;
}

const fillRegion = (x: number, y: number, disk: string[][]) => {
  if (disk[x][y] !== "1") return false;

  const toCheck: [number, number][] = [[x, y]];

  while (toCheck.length > 0) {
    const [cX, cY] = toCheck.pop()!;

    if (cX < 0 || cX >= disk.length || cY < 0 || cY >= disk.length) continue;
    if (disk[cX][cY] !== "1") continue;

    disk[cX][cY] = "#";

    const neighbours: [number, number][] = [
      [cX - 1, cY],
      [cX + 1, cY],
      [cX, cY - 1],
      [cX, cY + 1],
    ];

    toCheck.push(...neighbours);
  }

  return true;
};

const minimize = (disk: string[][], size = 8) => {
  return disk.slice(0, size).map((row) => row.slice(0, size));
};

const print = (disk: string[][]) => {
  console.log("");
  disk.forEach((row) => console.log(row.join()));
  console.log("");
};

function part2(getDisk: DayInputType): Solution {
  // const disk = minimize(getDisk().map((row) => row.split("")));
  const disk = getDisk().map((row) => row.split(""));

  let regionCount = 0;

  for (let x = 0; x < disk.length; x++) {
    for (let y = 0; y < disk.length; y++) {
      if (fillRegion(x, y, disk)) regionCount++;
    }
  }
  return regionCount;
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
