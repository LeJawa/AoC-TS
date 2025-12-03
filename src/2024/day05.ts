import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 5;
const lines = readInput(day, year);

type DayInputType = {
  updates: number[][];
  pageAfterRules: { [x: string]: number[] };
  pageBeforeRules: { [x: string]: number[] };
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const pageAfterRules: { [x: string]: number[] } = {};
  const pageBeforeRules: { [x: string]: number[] } = {};
  const updates: number[][] = [];

  let parsingRules = true;
  lines.forEach((line) => {
    if (parsingRules && !line.includes("|")) {
      parsingRules = false;
    }

    if (parsingRules) {
      const [x, y] = line.match(/\d+/g)!.map((n) => parseInt(n));

      if (pageAfterRules[x] === undefined) {
        pageAfterRules[x] = [];
      }
      if (pageBeforeRules[y] === undefined) {
        pageBeforeRules[y] = [];
      }

      pageAfterRules[x].push(y);
      pageBeforeRules[y].push(x);
    } else {
      const update = line.split(",").map((n) => parseInt(n));
      updates.push(update);
    }
  });

  Object.keys(pageAfterRules).forEach((k) => {
    pageAfterRules[k].sort((a, b) => a - b);
  });
  Object.keys(pageBeforeRules).forEach((k) => {
    pageBeforeRules[k].sort((a, b) => a - b);
  });

  return { updates, pageBeforeRules, pageAfterRules };
}

// Returns value of middle page if correct, else 0
function checkUpdate(
  update: number[],
  pageAfterRules: {
    [x: string]: number[];
  },
  pageBeforeRules: {
    [x: string]: number[];
  }
): number {
  let updateError = false;

  update.forEach((p, i, arr) => {
    if (updateError) return;

    const pagesBefore = arr.slice(0, i);
    const pagesAfter = arr.slice(i + 1);

    pagesBefore.forEach((pb) => {
      if (pageAfterRules[p]?.includes(pb)) {
        updateError = true;
        return;
      }
    });
    pagesAfter.forEach((pa) => {
      if (pageBeforeRules[p]?.includes(pa)) {
        updateError = true;
        return;
      }
    });
  });

  if (updateError) return 0;

  return update[Math.floor(update.length / 2)];
}

// Fixes update and returns value of middle page
function fixUpdate(
  update: number[],
  pageAfterRules: {
    [x: string]: number[];
  },
  pageBeforeRules: {
    [x: string]: number[];
  }
): number {
  let updateError = true;

  while (updateError) {
    updateError = false;
    update.forEach((p, i, arr) => {
      if (updateError) return;

      const pagesBefore = arr.slice(0, i);
      const pagesAfter = arr.slice(i + 1);

      pagesBefore.forEach((pb, j) => {
        if (updateError) return;
        if (pageAfterRules[p]?.includes(pb)) {
          updateError = true;

          arr[i] = pb;
          arr[j] = p;
          return;
        }
      });
      pagesAfter.forEach((pa, k) => {
        if (updateError) return;
        if (pageBeforeRules[p]?.includes(pa)) {
          updateError = true;
          arr[i] = pa;
          arr[i + k + 1] = p;
          return;
        }
      });
    });
  }

  const middlePage = update[Math.floor(update.length / 2)];

  return middlePage;
}

function part1({
  updates,
  pageBeforeRules,
  pageAfterRules,
}: DayInputType): Solution {
  let correctMiddlePageSum = 0;
  updates.forEach((update) => {
    const middlePage = checkUpdate(update, pageAfterRules, pageBeforeRules);
    correctMiddlePageSum += middlePage;
  });

  return correctMiddlePageSum;
}

function part2({
  updates,
  pageBeforeRules,
  pageAfterRules,
}: DayInputType): Solution {
  let wrongMiddlePageSum = 0;
  updates.forEach((update) => {
    const middlePage = checkUpdate(update, pageAfterRules, pageBeforeRules);
    if (middlePage === 0) {
      wrongMiddlePageSum += fixUpdate(update, pageAfterRules, pageBeforeRules);
    }
  });

  return wrongMiddlePageSum;
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
