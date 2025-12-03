import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 11;
const lines = readInput(day, year);

type DayInputType = number[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0].split(" ").map((x) => parseInt(x));
}

const getNumberOfDigits = (x: number) => (Math.log(x) * Math.LOG10E + 1) | 0;

const addToDict = (stone: number, amount: number, dict: IStoneDict) => {
  if (dict[stone] === undefined) dict[stone] = 0;

  dict[stone] += amount;

  if (dict[stone] === 0) delete dict[stone];
  return dict;
};

const doBlink = (stoneDict: IStoneDict) => {
  const old = JSON.parse(JSON.stringify(stoneDict));

  Object.keys(old).forEach((key) => {
    const amount = old[key];

    if (amount === 0) return;
    const stone = parseInt(key);

    stoneDict = addToDict(stone, -amount, stoneDict);
    if (stone === 0) stoneDict = addToDict(1, amount, stoneDict);
    else {
      const stoneDigits = getNumberOfDigits(stone);
      if (stoneDigits % 2 === 1) {
        stoneDict = addToDict(stone * 2024, amount, stoneDict);
      } else {
        const halfDivisor = 10 ** (stoneDigits / 2);
        stoneDict = addToDict(
          Math.trunc(stone / halfDivisor),
          amount,
          stoneDict
        );
        stoneDict = addToDict(stone % halfDivisor, amount, stoneDict);
      }
    }
  });
  return stoneDict;
};

interface IStoneDict {
  [n: string]: number;
}

const doNBlinks = (stones: number[], n: number) => {
  let blink = 0;
  let stoneDict: IStoneDict = {};
  stones.forEach((stone) => (stoneDict[stone] = 1));

  while (blink < n) {
    stoneDict = doBlink(stoneDict);
    blink++;
    // console.log(blink, stones.length);
  }

  return Object.keys(stoneDict).reduce((prev, curr) => {
    return (prev += stoneDict[curr]);
  }, 0);
};

function part1(stones: DayInputType): Solution {
  const totalBlinks = 25;
  return doNBlinks(stones, totalBlinks);
}

function part2(stones: DayInputType): Solution {
  const totalBlinks = 75;
  return doNBlinks(stones, totalBlinks);
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
