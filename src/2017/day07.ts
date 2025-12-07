import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 7;
const lines = readInput(day, year);

type DayInputType = string[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) => line.split(" -> "));
}

function part1(rawTowers: DayInputType): Solution {
  const towers = new Set<string>();
  const toCheck = new Set<string>();

  for (const rawtower of rawTowers) {
    const name = rawtower[0].split(/\W+/)[0];
    towers.add(name);

    if (rawtower.length === 1) continue;

    for (const a of rawtower[1].split(", ")) {
      toCheck.add(a);
    }
  }

  for (const name of towers.values()) {
    if (!toCheck.has(name)) return name;
  }

  return null;
}

class Tower {
  name: string;
  weight: number;
  towers: Tower[];
  support: Tower = null!;

  constructor(name: string, weight: number, towers: Tower[] = []) {
    this.name = name;
    this.weight = weight;
    this.towers = towers;
  }

  getTotalWeight() {
    // if (this.towers.length === 0) return this.weight;

    let towerWeight = 0;
    for (const tower of this.towers) {
      towerWeight += tower.getTotalWeight();
    }

    return towerWeight + this.weight;
  }
}

function part2(rawTowers: DayInputType): Solution {
  const towers: { [name: string]: Tower } = {};
  const queue = [...rawTowers];

  while (queue.length > 0) {
    const next = queue.shift()!;

    const match = next[0].match(/(\w+) \((\d+)\)/)!;
    const name = match[1],
      weight = match[2];

    if (next.length === 1) {
      towers[name] = new Tower(name, parseInt(weight));
      continue;
    }

    const subtowers = next[1].split(", ");
    if (subtowers.every((sub) => Object.keys(towers).includes(sub))) {
      towers[name] = new Tower(
        name,
        parseInt(weight),
        subtowers.map((sub) => towers[sub])
      );

      for (const sub of subtowers) {
        towers[sub].support = towers[name];
      }
    } else queue.push(next);
  }

  let lowerTower: Tower = null!;

  for (const tower of Object.values(towers)) {
    if (tower.support === null) {
      lowerTower = tower;
      break;
    }
  }

  let nextTower = lowerTower,
    wrongTower = null,
    rightWeight = 0;

  while (wrongTower === null) {
    const towerWeights = nextTower.towers
      .map((tower) => [tower.getTotalWeight(), tower] as [number, Tower])
      .sort(([a], [b]) => a - b);

    if (towerWeights[0][0] != towerWeights[1][0]) {
      nextTower = towerWeights[0][1];
      rightWeight = towerWeights[1][0];
    } else if (
      towerWeights[towerWeights.length - 1][0] !=
      towerWeights[towerWeights.length - 2][0]
    ) {
      nextTower = towerWeights[towerWeights.length - 1][1];
      rightWeight = towerWeights[towerWeights.length - 2][0];
    } else wrongTower = nextTower;
  }

  const delta = rightWeight - wrongTower.getTotalWeight();

  return wrongTower.weight + delta;
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
