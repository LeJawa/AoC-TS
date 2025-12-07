import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 1;
const lines = readInput(day, year);

type DayInputType = string;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0];
}

function part1(digits: DayInputType): Solution {
  const size = digits.length;
  let captcha = 0;
  let next_index = 0;
  Array.from(digits).forEach((d, i) => {
    if (i === size - 1) next_index = 0;
    else next_index = i + 1;

    if (d === digits[next_index]) captcha += parseInt(d);
  });

  return captcha;
}

function part2(digits: DayInputType): Solution {
  const size = digits.length;
  let captcha = 0;
  let next_index = 0;
  Array.from(digits).forEach((d, i) => {
    next_index = (i + size / 2) % size;

    if (d === digits[next_index]) captcha += parseInt(d);
  });

  return captcha;
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
