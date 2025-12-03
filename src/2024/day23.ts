import { readInput, timeIt } from "../common";
import { combinations } from "../lib/math";
import { type Solution } from "../types";

const year = 2024;
const day = 23;
const lines = readInput(day, year);

type DayInputType = { [pc: string]: string[] };

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const pcs: { [pc: string]: string[] } = {};

  lines
    .map((line) => [line.slice(0, 2), line.slice(3)])
    .forEach(([pca, pcb]) => {
      if (pcs[pca] === undefined) pcs[pca] = [];
      if (pcs[pcb] === undefined) pcs[pcb] = [];

      pcs[pca].push(pcb);
      pcs[pcb].push(pca);
    });

  return pcs;
}

function part1(pcs: DayInputType): Solution {
  const connections = new Set<string>();

  for (const pc of Object.keys(pcs)) {
    if (!pc.startsWith("t")) continue;

    const pcCombinations = combinations(pcs[pc], 2);

    for (const [a, b] of pcCombinations) {
      if (pcs[a].includes(b)) {
        connections.add(
          [pc, a, b].toSorted((a, b) => (a < b ? -1 : 1)).join("")
        );
      }
    }
  }
  return connections.size;
}

function part2(pcs: DayInputType): Solution {
  return null;
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
