import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2018;
const day = 2;
const lines = readInput(day, year);

type DayInputType = string[];

const defaultId = "uqcipadzwtnheslgvxjobmkfyr";

// Returns the manipulated input lines
function setup(lines: string[]): string[] {
  return lines;
}

function part1(input: DayInputType): Solution {
  let twoCount = 0;
  let threeCount = 0;

  input.forEach((id) => {
    const repeat: { [letter: string]: number } = {};

    Array.from(id).forEach((c, i) => {
      if (c !== defaultId[i]) {
        repeat[c] = repeat[c] !== undefined ? repeat[c] + 1 : 2;
        repeat[defaultId[i]] =
          repeat[defaultId[i]] !== undefined ? repeat[defaultId[i]] - 1 : 0;
      }
    });

    let two = false;
    let three = false;
    Object.values(repeat).forEach((n) => {
      if (n === 2) two = true;
      else if (n === 3) three = true;
    });

    twoCount += two ? 1 : 0;
    threeCount += three ? 1 : 0;
  });
  return twoCount * threeCount;
}

function part2(input: DayInputType): Solution {
  // TODO: Implement Part 2
  return null;
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
