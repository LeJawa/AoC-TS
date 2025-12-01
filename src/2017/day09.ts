import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 9;
const lines = readInput(day, year);

type DayInputType = string;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0];
}

function part1(stream: DayInputType): Solution {
  let totalValue = 0;
  let groupValue = 1;
  const previousGroupValues: number[] = [];

  let inGarbage = false;

  let cancelNext = false;

  for (const c of stream) {
    let notThisRound = false;
    if (!inGarbage && c === "{") {
      totalValue += groupValue;
      previousGroupValues.push(groupValue);
      groupValue += 1;
    } else if (!inGarbage && c === "}") {
      groupValue = previousGroupValues.pop()!;
    } else if (!inGarbage && c === "<") {
      inGarbage = true;
    } else if (inGarbage && c === ">" && !cancelNext) {
      inGarbage = false;
    } else if (inGarbage && c === "!" && !cancelNext) {
      cancelNext = true;
      notThisRound = true;
    }

    if (cancelNext && !notThisRound) {
      cancelNext = false;
    }
  }

  return totalValue;
}

function part2(stream: DayInputType): Solution {
  let totalGarbage = 0;

  let inGarbage = false;

  let cancelNext = false;

  for (const c of stream) {
    let notThisRound = false;
    if (!inGarbage && c === "{") {
    } else if (!inGarbage && c === "}") {
    } else if (!inGarbage && c === "<") {
      inGarbage = true;
    } else if (inGarbage && c === ">" && !cancelNext) {
      inGarbage = false;
    } else if (inGarbage && c === "!" && !cancelNext) {
      cancelNext = true;
      notThisRound = true;
    } else if (inGarbage && !cancelNext) {
      totalGarbage++;
    }

    if (cancelNext && !notThisRound) {
      cancelNext = false;
    }
  }

  return totalGarbage;
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
