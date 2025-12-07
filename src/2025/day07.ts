import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 7;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.filter((line) => /[\^S]/.test(line));
}

function part1(input: DayInputType): Solution {
  const start = input[0].indexOf("S");
  let beams = new Set([start]);

  let splits = 0;

  for (let i = 1; i < input.length; i++) {
    const newBeams: Set<number> = new Set();

    beams.forEach((beam) => {
      if (input[i][beam] === "^") {
        splits++;
        newBeams.add(beam - 1);
        newBeams.add(beam + 1);
      } else newBeams.add(beam);
    });
    beams = newBeams;
  }

  return splits;
}

function part2(input: DayInputType): Solution {
  const start = input[0].indexOf("S");
  let beams = new Set([start]);

  let beamCount: { [b: number]: number } = { [start]: 1 };

  for (let i = 1; i < input.length; i++) {
    const newBeams: Set<number> = new Set();
    beams.forEach((beam) => {
      if (input[i][beam] === "^") {
        beamCount[beam - 1] = (beamCount[beam - 1] ?? 0) + beamCount[beam];
        beamCount[beam + 1] = (beamCount[beam + 1] ?? 0) + beamCount[beam];

        beamCount[beam] = 0;
        newBeams.add(beam - 1);
        newBeams.add(beam + 1);
      } else newBeams.add(beam);
    });

    beams = newBeams;
  }

  return Object.values(beamCount).reduce((sum, curr) => sum + curr, 0);
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
