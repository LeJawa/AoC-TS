import { readInput, timeIt } from "../common";
import { permutations } from "../lib/math";
import { type Solution } from "../types";

const year = 2024;
const day = 8;
const lines = readInput(day, year);

type DayInputType = {
  antennas: {
    [key: string]: number[][];
  };
  size: number;
};

// Returns the manipulated input lines
function setup(lines: string[]) {
  const fullMap = lines.join("");
  const size = Math.sqrt(fullMap.length);

  const getCoord = (index: number) => {
    return [index % size, Math.trunc(index / size)];
  };

  const antennas: { [key: string]: number[][] } = {};

  Array.from(fullMap).forEach((c, i) => {
    if (c === ".") return;
    if (antennas[c] === undefined) antennas[c] = [];
    antennas[c].push(getCoord(i));
  });

  return { antennas, size };
}
const findAntinodes = (
  a: number[],
  b: number[],
  size: number,
  part: number = 1
) => {
  const deltaX = b[0] - a[0];
  const deltaY = b[1] - a[1];

  const maxX = Math.abs(Math.trunc(size / deltaX));
  const maxY = Math.abs(Math.trunc(size / deltaY));

  const minmax = Math.min(maxX, maxY);

  const antinodes: number[][] = [];

  if (part === 2) {
    for (let i = 0; i < minmax; i++) {
      antinodes.push([a[0] - deltaX * i, a[1] - deltaY * i]);
      antinodes.push([b[0] + deltaX * i, b[1] + deltaY * i]);
    }
  } else {
    antinodes.push([a[0] - deltaX, a[1] - deltaY]);
    antinodes.push([b[0] + deltaX, b[1] + deltaY]);
  }

  return antinodes;
};

const _printMap = (antinodes: Set<string>, fullMap: string) => {
  const antinodes_indices: number[] = [];
  const size = Math.sqrt(fullMap.length);

  antinodes.forEach((location) => {
    const [x, y] = location.split(",").map((x) => parseInt(x));
    antinodes_indices.push(x + y * size);
  });

  let map = "";
  let x = 0;
  Array.from(fullMap).forEach((location, index) => {
    if (antinodes_indices.includes(index)) {
      map += "#";
    } else {
      map += location;
    }
    x = (x + 1) % size;
    if (x === 0) {
      map += "\n";
    }
  });

  console.log(map);
};

function part1({ antennas, size }: DayInputType): Solution {
  const uniqueAntinodes = new Set<string>();

  Object.keys(antennas).forEach((frequency) => {
    const perms = permutations(antennas[frequency], 2);
    perms.forEach((pair) => {
      const antinodes = findAntinodes(pair[0], pair[1], size, 1);
      antinodes.forEach(([x, y]) => {
        if (x < 0 || x >= size || y < 0 || y >= size) return;
        uniqueAntinodes.add(`${x},${y}`);
      });
    });
  });

  return uniqueAntinodes.size;
}

function part2({ antennas, size }: DayInputType): Solution {
  const uniqueAntinodes = new Set<string>();

  Object.keys(antennas).forEach((frequency) => {
    const perms = permutations(antennas[frequency], 2);
    perms.forEach((pair) => {
      const antinodes = findAntinodes(pair[0], pair[1], size, 2);
      antinodes.forEach(([x, y]) => {
        if (x < 0 || x >= size || y < 0 || y >= size) return;
        uniqueAntinodes.add(`${x},${y}`);
      });
    });
  });

  return uniqueAntinodes.size;
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
