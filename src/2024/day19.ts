import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 19;
const lines = readInput(day, year);

type DayInputType = {
  towels: string[];
  patterns: string[];
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const towels = lines[0].split(", ");
  const patterns = lines.slice(1);

  return { towels, patterns };
}

const possiblePatternsRegex = (patterns: string[], towels: string[]) => {
  const possible: string[] = [];

  const towelRegex = new RegExp(`^(?:${towels.join("|")})+$`);

  patterns.forEach((pattern) => {
    if (towelRegex.exec(pattern)) possible.push(pattern);
  });

  return possible;
};

function part1({ patterns, towels }: DayInputType): Solution {
  const possible = possiblePatternsRegex(patterns, towels);

  return possible.length;
}

function part2({ patterns, towels }: DayInputType): Solution {
  const towelDict: { [letter: string]: string[] } = {};

  towels.forEach((towel) => {
    const letter = towel[0];

    if (towelDict[letter] === undefined) towelDict[letter] = [];

    towelDict[letter].push(towel);
  });

  const knownCombinations: { [pattern: string]: number } = {};

  const recursiveFind = (pattern: string) => {
    if (pattern === "") return 1;

    if (knownCombinations[pattern] !== undefined) {
      return knownCombinations[pattern];
    }

    let combinations = 0;

    towelDict[pattern[0]].forEach((towel) => {
      if (pattern.startsWith(towel)) {
        const subcombinations = recursiveFind(pattern.slice(towel.length));

        if (subcombinations > 0) {
          if (knownCombinations[pattern] === undefined) {
            knownCombinations[pattern] = 0;
          }
          knownCombinations[pattern] += subcombinations;
        }
        combinations += subcombinations;
      }
    });

    return combinations;
  };

  let combinations = 0;

  patterns.forEach((pattern) => {
    combinations += recursiveFind(pattern);
  });

  return combinations;
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
