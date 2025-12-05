import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 5;
const lines = readInput(day, year);

type DayInputType = {
  ranges: [number, number][];
  ids: number[];
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const ranges: [number, number][] = [];
  const ids: number[] = [];

  lines.forEach((line) => {
    const splitIndex = line.indexOf("-");
    if (splitIndex != -1) {
      ranges.push([
        parseInt(line.slice(0, splitIndex)),
        parseInt(line.slice(splitIndex + 1)),
      ]);
    } else {
      ids.push(parseInt(line));
    }
  });

  const sortedRanges = ranges.toSorted(([a], [b]) => a - b);
  const sortedIds = ids.toSorted((a, b) => a - b);
  return { ranges: sortedRanges, ids: sortedIds };
}

function part1({ ranges, ids }: DayInputType): Solution {
  let freshIds = 0;
  let rangeIndex = 0;
  for (const id of ids) {
    for (let i = rangeIndex; i < ranges.length; i++) {
      if (ranges[i][0] > id) {
        break;
      }

      if (id <= ranges[i][1]) {
        freshIds++;
        rangeIndex = i;
        break;
      }
    }
  }

  return freshIds;
}

function part2({ ranges }: DayInputType): Solution {
  let freshIdCount = 0;
  let previousRange = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i][0] <= previousRange[1]) {
      if (ranges[i][1] > previousRange[1]) previousRange[1] = ranges[i][1];
    } else {
      freshIdCount += previousRange[1] - previousRange[0] + 1;

      previousRange = ranges[i];
    }
  }

  freshIdCount += previousRange[1] - previousRange[0] + 1;

  return freshIdCount;
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
