import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 13;
const lines = readInput(day, year);

type DayInputType = number[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return Array.from(
    lines
      .join("\n")
      .matchAll(
        /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g
      )
  ).map(([_, xa, ya, xb, yb, xt, yt]) => [
    parseInt(xa),
    parseInt(ya),
    parseInt(xb),
    parseInt(yb),
    parseInt(xt),
    parseInt(yt),
  ]);
}

const getNecessarytokens = ([xa, ya, xb, yb, xt, yt]: number[]) => {
  const b = (yt - (ya * xt) / xa) / (yb - (ya * xb) / xa);
  const a = (xt - b * xb) / xa;
  if (
    parseFloat(b.toFixed(3)) === Math.round(b) &&
    parseFloat(a.toFixed(3)) === Math.round(a)
  ) {
    return a * 3 + b;
  } else return 0;
};

function part1(matches: DayInputType): Solution {
  let totalTokens = 0;
  matches.forEach((match) => {
    const tokens = getNecessarytokens(match);
    totalTokens += tokens;
  });

  return totalTokens;
}

function part2(matches: DayInputType): Solution {
  let totalTokens = 0;
  matches.forEach(([xa, ya, xb, yb, xt, yt]) => {
    const tokens = getNecessarytokens([
      xa,
      ya,
      xb,
      yb,
      xt + 10000000000000,
      yt + 10000000000000,
    ]);
    totalTokens += tokens;
  });

  return totalTokens;
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
