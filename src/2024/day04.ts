import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 4;
const lines = readInput(day, year);

type DayInputType = string;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.join("");
}

function findWordCount(word: string, input: string) {
  let count = 0;
  const size = Math.sqrt(input.length);

  Array.from(input).forEach((_, i, arr) => {
    if (arr[i] !== word[0]) return;

    const x = i % size;
    const y = Math.trunc(i / size);

    // console.log(x, y);

    if (x < size - 3) {
      if (
        arr[i + 1] === word[1] &&
        arr[i + 2] === word[2] &&
        arr[i + 3] === word[3]
      ) {
        count++;
      }
      if (y < size - 3) {
        if (
          arr[i + size + 1] === word[1] &&
          arr[i + 2 * size + 2] === word[2] &&
          arr[i + 3 * size + 3] === word[3]
        ) {
          count++;
        }
      }
    }
    if (y < size - 3) {
      if (
        arr[i + size] === word[1] &&
        arr[i + 2 * size] === word[2] &&
        arr[i + 3 * size] === word[3]
      ) {
        count++;
      }
      if (x > 2) {
        if (
          arr[i + size - 1] === word[1] &&
          arr[i + 2 * size - 2] === word[2] &&
          arr[i + 3 * size - 3] === word[3]
        ) {
          count++;
        }
      }
    }
  });

  return count;
}

function findCrossMas(input: string) {
  let count = 0;
  const size = Math.sqrt(input.length);

  Array.from(input).forEach((_, i, arr) => {
    if (arr[i] !== "A") return;

    const x = i % size;
    const y = Math.trunc(i / size);

    if (x == 0 || x == size - 1 || y == 0 || y == size - 1) return;

    if (
      (arr[i - size - 1] === "M" && arr[i + size + 1] == "S") ||
      (arr[i - size - 1] === "S" && arr[i + size + 1] == "M")
    ) {
      if (
        (arr[i - size + 1] === "M" && arr[i + size - 1] == "S") ||
        (arr[i - size + 1] === "S" && arr[i + size - 1] == "M")
      ) {
        count++;
      }
    }
  });

  return count;
}

function part1(input: DayInputType): Solution {
  return findWordCount("XMAS", input) + findWordCount("SAMX", input);
}

function part2(input: DayInputType): Solution {
  return findCrossMas(input);
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
