import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 2;
const lines = readInput(day, year);

type DayInputType = [string, string][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const ranges = lines[0]
    .split(",")
    .map((range) => range.split("-") as [string, string]);
  return ranges;
}

function part1(ranges: DayInputType): Solution {
  let invalidIdSum = 0;

  for (const range of ranges) {
    if (range[0].length === range[1].length && range[0].length % 2 === 1)
      continue;

    const r0 = parseInt(range[0]);
    const r1 = parseInt(range[1]);
    for (let i = r0; i <= r1; i++) {
      const s = i.toString();
      if (s.length % 2 === 1) continue;

      const s1 = s.slice(0, s.length / 2);
      const s2 = s.slice(s.length / 2);

      if (s1 === s2) invalidIdSum += i;
    }
  }

  return invalidIdSum;
}

function* splitIntoParts(s: string, parts: number): IterableIterator<string> {
  const length = s.length / parts;

  for (let i = 0; i < s.length; i += length) {
    yield s.slice(i, i + length);
  }
}

function part2(ranges: DayInputType): Solution {
  let invalidIdSum = 0;

  for (const range of ranges) {
    const r0 = parseInt(range[0]);
    const r1 = parseInt(range[1]);
    for (let i = r0; i <= r1; i++) {
      const s = i.toString();

      if (s.length === 1) continue;

      // Test all digits equal
      if (s.split("").every((c) => c === s[0])) {
        invalidIdSum += i;
        continue;
      }

      // Test division by 2, 3 or 5 parts
      for (let n = 2; n < s.length && n <= 5; n++) {
        if (n === 4 || s.length % n !== 0) continue;

        let allEqual = true;
        let p0: string = undefined!;
        for (const p of splitIntoParts(s, n)) {
          if (p0 === undefined) {
            p0 = p;
            continue;
          }

          if (p !== p0) {
            allEqual = false;
            break;
          }
        }
        if (allEqual) {
          invalidIdSum += i;
          break;
        }
      }
    }
  }

  return invalidIdSum;
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
