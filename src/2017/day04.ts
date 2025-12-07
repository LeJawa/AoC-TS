import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 4;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

function part1(passwords: DayInputType): Solution {
  let validPasswords = 0;

  for (const pw of passwords) {
    const words = pw.split(/\W/);

    const notValid = words.some((w, i) => words.slice(i + 1).includes(w));
    if (!notValid) validPasswords++;
  }

  return validPasswords;
}

function part2(passwords: DayInputType): Solution {
  let validPasswords = 0;

  for (const pw of passwords) {
    const words = pw.split(/\W/);

    const notValid = words.some((w, i) =>
      words
        .slice(i + 1)
        .map((c) => Array.from(c).sort().join())
        .includes(Array.from(w).sort().join())
    );
    if (!notValid) validPasswords++;
  }

  return validPasswords;
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
