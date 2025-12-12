import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 12;

const IS_RAW_INPUT = false; // set to true if lines is raw input
const lines = readInput(day, year, IS_RAW_INPUT);

type DayInputType = ReturnType<typeof setup>;

// Returns the manipulated input lines
function setup(lines: string[]) {
  let i = 0;

  const shapes: boolean[][][] = [];

  while (true) {
    if (!lines[i].includes("x")) {
      shapes.push([
        lines[i + 1].split("").map((c) => c === "#"),
        lines[i + 2].split("").map((c) => c === "#"),
        lines[i + 3].split("").map((c) => c === "#"),
      ]);
      i += 4;
    } else break;
  }

  const areas: { w: number; h: number; gifts: number[] }[] = [];

  while (i < lines.length) {
    const match = /(?<w>\d+)x(?<h>\d+): (?<gifts>(?:\d+ ?)+)/.exec(lines[i]);

    if (!match || !match.groups) continue;

    areas.push({
      w: parseInt(match.groups["w"]),
      h: parseInt(match.groups["h"]),
      gifts: match.groups["gifts"].split(" ").map((x) => parseInt(x)),
    });

    i++;
  }

  return { shapes, areas };
}

// TODO: maybe?
const solveArea = (
  area: DayInputType["areas"][number],
  shapes: DayInputType["shapes"]
) => {
  return false;
};

function part1({ shapes, areas }: DayInputType): Solution {
  const minShapeAreas: number[] = [];
  const maxShapeAreas: number[] = [];
  for (const shape of shapes) {
    let minArea = 0;
    let maxArea = 0;

    for (const row of shape) {
      row.forEach((c) => (minArea += c ? 1 : 0));
      maxArea += row.length;
    }

    minShapeAreas.push(minArea);
    maxShapeAreas.push(maxArea);
  }

  let possibleAreas = 0;

  const maybeAreas: typeof areas = [];

  for (const { w, h, gifts } of areas) {
    const minGiftArea = gifts.reduce((s, g, i) => s + g * minShapeAreas[i], 0);
    const maxGiftArea = gifts.reduce((s, g, i) => s + g * maxShapeAreas[i], 0);

    if (maxGiftArea <= w * h) possibleAreas++;
    else if (minGiftArea > w * h) continue;
    else maybeAreas.push({ w, h, gifts });
  }

  if (maybeAreas.length === 0) return possibleAreas;

  for (const area of maybeAreas) {
    if (solveArea(area, shapes)) possibleAreas++;
  }

  return possibleAreas;
}

function part2(_: DayInputType): Solution {
  return "You're missing 2 stars! Go back and get them!";
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

export { setup, part1, part2, IS_RAW_INPUT };
