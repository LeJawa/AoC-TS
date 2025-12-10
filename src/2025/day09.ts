import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 9;

const IS_RAW_INPUT = false; // set to true if lines is raw input
const lines = readInput(day, year, IS_RAW_INPUT);

type DayInputType = [number, number][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map(
    (line) => line.split(",").map((x) => parseInt(x)) as [number, number]
  );
}

const getArea = (a: [number, number], b: [number, number]) => {
  return (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1);
};

function part1(input: DayInputType): Solution {
  const area: { [cornerA: string]: { [cornerB: string]: number } } = {};
  let maxArea = 0;

  for (const a in input) {
    if (area[a] === undefined) area[a] = {};
    for (const b in input) {
      if (a === b) continue;
      if (area[b] && area[b][a] !== undefined) continue;

      area[a][b] = getArea(input[a], input[b]);

      if (area[a][b] > maxArea) maxArea = area[a][b];
    }
  }
  return maxArea;
}

const getPointsBetween = (
  a: [number, number],
  b: [number, number],
  excludeFirst = false
) => {
  const points: string[] = [];
  if (a[0] === b[0]) {
    for (let i = excludeFirst ? 1 : 0; i < Math.abs(b[1] - a[1]) + 1; i++) {
      points.push(`${a[0]},${a[1] + (b[1] > a[1] ? i : -i)}`);
    }
  } else {
    for (let i = excludeFirst ? 1 : 0; i < Math.abs(b[0] - a[0]) + 1; i++) {
      points.push(`${a[0] + (b[0] > a[0] ? i : -i)},${a[1]}`);
    }
  }

  return points;
};

function part2(input: DayInputType): Solution {
  const corners = input.map((c) => `${c[0]},${c[1]}`);

  const redCorners = new Set(corners);
  const boundaries = new Set(corners);

  for (let i = 0; i < input.length - 1; i++) {
    getPointsBetween(input[i], input[i + 1]).forEach((p) => boundaries.add(p));
  }
  getPointsBetween(input.at(-1)!, input[0]).forEach((p) => boundaries.add(p));

  let maxArea = 0;

  const size = 20;

  for (let i = 0; i < input.length; i++) {
    const right = getPointsBetween(input[i], [size, input[i][1]], true);
    const rfind = right.findLast((p) => boundaries.has(p));
    const left = getPointsBetween(input[i], [0, input[i][1]], true);
    const lfind = left.findLast((p) => boundaries.has(p));

    const cornerAr = rfind?.split(",").map((x) => parseInt(x));
    const cornerAl = lfind?.split(",").map((x) => parseInt(x));

    const up = getPointsBetween(input[i], [input[i][0], 0], true);
    const ufind = up.findLast((p) => boundaries.has(p))!;
    const down = getPointsBetween(input[i], [input[i][0], size], true);
    const dfind = down.findLast((p) => boundaries.has(p))!;

    const cornerBu = ufind?.split(",").map((x) => parseInt(x));
    const cornerBd = dfind?.split(",").map((x) => parseInt(x));

    const cornerCrrd =
      cornerAr === undefined || cornerBd === undefined
        ? undefined
        : getPointsBetween(
            cornerAr as [number, number],
            [cornerAr[0], cornerBd[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerCrdd =
      cornerAr === undefined || cornerBd === undefined
        ? undefined
        : getPointsBetween(
            cornerBd as [number, number],
            [cornerAr[0], cornerBd[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerClld =
      cornerAl === undefined || cornerBd === undefined
        ? undefined
        : getPointsBetween(
            cornerAl as [number, number],
            [cornerAl[0], cornerBd[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerCldd =
      cornerAl === undefined || cornerBd === undefined
        ? undefined
        : getPointsBetween(
            cornerBd as [number, number],
            [cornerAl[0], cornerBd[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerCruu =
      cornerAr === undefined || cornerBu === undefined
        ? undefined
        : getPointsBetween(
            cornerBu as [number, number],
            [cornerAr[0], cornerBu[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerCrru =
      cornerAr === undefined || cornerBu === undefined
        ? undefined
        : getPointsBetween(
            cornerAr as [number, number],
            [cornerAr[0], cornerBu[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerCluu =
      cornerAl === undefined || cornerBu === undefined
        ? undefined
        : getPointsBetween(
            cornerBu as [number, number],
            [cornerAl[0], cornerBu[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));
    const cornerCllu =
      cornerAl === undefined || cornerBu === undefined
        ? undefined
        : getPointsBetween(
            cornerAl as [number, number],
            [cornerAl[0], cornerBu[1]],
            true
          ).findLast((p) => boundaries.has(p) && redCorners.has(p));

    if (!!cornerCrru) {
      const area = getArea(
        input[i],
        cornerCrru.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCrru}`);
        console.log(area);
      }
    }
    if (!!cornerCruu) {
      const area = getArea(
        input[i],
        cornerCruu.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCruu}`);
        console.log(area);
      }
    }
    if (!!cornerCrrd) {
      const area = getArea(
        input[i],
        cornerCrrd.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCrrd}`);
        console.log(area);
      }
    }
    if (!!cornerCrdd) {
      const area = getArea(
        input[i],
        cornerCrdd.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCrdd}`);
        console.log(area);
      }
    }
    if (!!cornerCllu) {
      const area = getArea(
        input[i],
        cornerCllu.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCllu}`);
        console.log(area);
      }
    }
    if (!!cornerCluu) {
      const area = getArea(
        input[i],
        cornerCluu.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCluu}`);
        console.log(area);
      }
    }
    if (!!cornerCldd) {
      const area = getArea(
        input[i],
        cornerCldd.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerCldd}`);
        console.log(area);
      }
    }
    if (!!cornerClld) {
      const area = getArea(
        input[i],
        cornerClld.split(",").map((x) => parseInt(x)) as [number, number]
      );
      if (area > maxArea) {
        maxArea = area;
        console.log(`${input[i][0]},${input[i][1]} => ${cornerClld}`);
        console.log(area);
      }
    }
  }
  return maxArea;
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
