import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 12;
const lines = readInput(day, year);

type DayInputType = {
  [key: number]: Set<number>;
};

const buildDict = (lines: string[]) => {
  const dict: { [key: number]: Set<number> } = {};
  const regex = /(\d+) <-> (.+)/;

  for (const line of lines) {
    const result = regex.exec(line);
    if (!result) continue;
    const connectors = result[2].split(", ").map((c) => parseInt(c));
    const origin = parseInt(result[1]);

    if (dict[origin] === undefined) dict[origin] = new Set(connectors);
    else connectors.forEach((c) => dict[origin].add(c));
  }

  return dict;
};

const buildGroup = (node: number, dict: DayInputType) => {
  const stack = [node];
  const checked = new Set<number>();

  while (stack.length > 0) {
    const current = stack.pop()!;
    checked.add(current);
    if (dict[current] === undefined) {
      checked.delete(current);
      continue;
    }

    const next = Array.from(dict[current]).filter((c) => !checked.has(c));

    stack.push(...next);
  }

  return checked;
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return buildDict(lines);
}

function part1(dict: DayInputType): Solution {
  const zeroGroup = buildGroup(0, dict);

  return zeroGroup.size;
}

function part2(dict: DayInputType): Solution {
  const checked = new Set<number>();
  let groupCount = 0;

  Object.keys(dict).forEach((n) => {
    const node = parseInt(n);
    if (checked.has(node)) return;

    const group = buildGroup(node, dict);
    groupCount++;

    for (const e of group.keys()) {
      checked.add(e);
    }
  });

  return groupCount;
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
