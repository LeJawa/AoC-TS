import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 21;
const lines = readInput(day, year);

type DayInputType = {
  [pattern: string]: string;
};

const getRotations = (pattern: string) => {
  if (pattern.length === 5) {
    const [p0, p1, _, p2, p3] = pattern;

    return [
      `${p0}${p1}/${p2}${p3}`,
      `${p1}${p0}/${p3}${p2}`,
      `${p2}${p0}/${p3}${p1}`,
      `${p0}${p2}/${p1}${p3}`,
      `${p3}${p2}/${p1}${p0}`,
      `${p2}${p3}/${p0}${p1}`,
      `${p1}${p3}/${p0}${p2}`,
      `${p3}${p1}/${p2}${p0}`,
    ];
  }
  const [p0, p1, p2, _, p3, p4, p5, __, p6, p7, p8] = pattern;

  return [
    `${p0}${p1}${p2}/${p3}${p4}${p5}/${p6}${p7}${p8}`,
    `${p2}${p1}${p0}/${p5}${p4}${p3}/${p8}${p7}${p6}`,
    `${p6}${p3}${p0}/${p7}${p4}${p1}/${p8}${p5}${p2}`,
    `${p0}${p3}${p6}/${p1}${p4}${p7}/${p2}${p5}${p8}`,
    `${p8}${p7}${p6}/${p5}${p4}${p3}/${p2}${p1}${p0}`,
    `${p6}${p7}${p8}/${p3}${p4}${p5}/${p0}${p1}${p2}`,
    `${p2}${p5}${p8}/${p1}${p4}${p7}/${p0}${p3}${p6}`,
    `${p8}${p5}${p2}/${p7}${p4}${p1}/${p6}${p3}${p0}`,
  ];
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const patternDict: { [pattern: string]: string } = {};
  lines.forEach((line) => {
    const [oldPattern, newPattern] = line.split(" => ");
    patternDict[oldPattern] = newPattern;
  });

  return patternDict;
}

const initialGrid = [".#.", "..#", "###"];

const grid2Line = (grid: typeof initialGrid, size: number) => {
  const line: typeof grid = [];
  for (let k = 0; k < size; k++) {
    line.push(grid[k]);
  }

  for (let i = 1; i < grid.length / size; i++) {
    for (let k = 0; k < size; k++) {
      line[k] = line[k].concat(grid[k + i * size]);
    }
  }

  return line;
};

const line2grid = (line: typeof initialGrid) => {
  const size = Math.sqrt(line.length * line[0].length);
  const grid: typeof line = [];
  let index = 0;

  while (index < line[0].length) {
    for (let i = 0; i < line.length; i++) {
      grid.push(line[i].slice(index, index + size));
    }
    index += size;
  }

  return grid;
};

const split = (grid: typeof initialGrid) => {
  const patterns: string[] = [];

  if (grid.length % 2 === 0) {
    const line = grid2Line(grid, 2);

    for (let i = 0; i < line[0].length / 2; i++) {
      patterns.push(
        `${line[0].slice(i * 2, i * 2 + 2)}/${line[1].slice(i * 2, i * 2 + 2)}`
      );
    }
  } else {
    const line = grid2Line(grid, 3);

    for (let i = 0; i < line[0].length / 3; i++) {
      patterns.push(
        `${line[0].slice(i * 3, i * 3 + 3)}/${line[1].slice(
          i * 3,
          i * 3 + 3
        )}/${line[2].slice(i * 3, i * 3 + 3)}`
      );
    }
  }

  return patterns;
};

const reconstruct = (patterns: string[]) => {
  const size = Math.sqrt(patterns.length);
  const grid: typeof initialGrid = [];

  for (let i = 0; i < patterns.length; i++) {
    const subPatterns = patterns[i].split("/");
    const subSize = subPatterns.length;
    for (let k = 0; k < subSize; k++) {
      const index = k + Math.floor(i / size) * subSize;
      if (grid.length - 1 < index) grid.push(subPatterns[k]);
      else grid[index] += subPatterns[k];
    }
  }

  return grid;
};

const getNewPattern = (old: string, patternDict: DayInputType) => {
  if (patternDict[old] === undefined) {
    const rotations = getRotations(old);

    for (const rotation of rotations) {
      if (patternDict[rotation] !== undefined) {
        patternDict[old] = patternDict[rotation];
        break;
      }
    }
  }
  return patternDict[old];
};

const doNIterations = (
  initGrid: typeof initialGrid,
  n: number,
  patternDict: DayInputType
) => {
  let grid = [...initGrid];

  for (let _ = 0; _ < n; _++) {
    grid = reconstruct(split(grid).map((p) => getNewPattern(p, patternDict)));
  }
  const lightsOn = grid.reduce(
    (count, row) => count + row.replace(/\./g, "").length,
    0
  );

  return lightsOn;
};

function part1(patternDict: DayInputType): Solution {
  return doNIterations(initialGrid, 5, patternDict);
}

function part2(patternDict: DayInputType): Solution {
  return doNIterations(initialGrid, 18, patternDict);
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
