import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 2;
const lines = readInput(day, year);

type DayInputType = number[][];

const isSafe = (report: number[], part2 = false): boolean => {
  const increasing = report[1] - report[0] > 0;
  let safe = true;
  let breakLoop = false;
  let indexToRemove: number = undefined!;
  report.forEach((n, i, array) => {
    if (breakLoop) return;

    if (i === array.length - 1) return;

    if (increasing) {
      if (!(array[i + 1] > n && array[i + 1] < n + 4)) {
        safe = false;

        if (part2) {
          indexToRemove = i + 1;
          breakLoop = true;
          return;
        }
      }
    } else if (!(array[i + 1] < n && array[i + 1] > n - 4)) {
      safe = false;

      if (part2) {
        indexToRemove = i + 1;
        breakLoop = true;
        return;
      }
    }
  });

  if (!safe && part2) {
    const newReport = report
      .slice(0, indexToRemove)
      .concat(report.slice(indexToRemove + 1));
    safe = isSafe(newReport);

    // If indexToRemove is second or third, we need to try removing first AND second indices as well
    if (!safe && (indexToRemove == 1 || indexToRemove == 2)) {
      safe = isSafe(report.slice(1));
      if (!safe) {
        safe = isSafe(report.slice(0, 1).concat(report.slice(2)));
      }
    }
  }
  return safe;
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) => line.match(/\d+/g)!.map((n) => parseInt(n)));
}

function part1(reports: DayInputType): Solution {
  let safeReports = 0;

  reports.forEach((report) => {
    if (isSafe(report)) safeReports++;
  });

  return safeReports;
}

function part2(reports: DayInputType): Solution {
  let safeReports = 0;

  reports.forEach((report) => {
    if (isSafe(report, true)) safeReports++;
  });

  return safeReports;
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
