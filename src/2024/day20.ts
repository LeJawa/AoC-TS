import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 20;
const lines = readInput(day, year);

type DayInputType = {
  map: string;
  start: number;
  end: number;
  path: number[];
  size: number;
  distances: {
    [index: string]: number;
  };
};

// Returns the manipulated input lines
function setup(lines: string[]) {
  const map = lines.join("");
  const size = Math.sqrt(map.length);
  const start = map.indexOf("S");
  const end = map.indexOf("E");
  const { path, distances } = bfs(map, end, start, size);

  return { map, size, start, end, path, distances };
}

interface Node {
  index: number;
  previousNode: Node;
}

const bfs = (map: string, start: number, end: number, size: number) => {
  const distances: { [index: string]: number } = {};

  const queue: Node[] = [];
  queue.push({ index: start, previousNode: null! });

  const visited = new Set<number>();

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const { index } = currentNode;

    if (map[index] === "#" || visited.has(index)) continue;
    visited.add(index);

    if (index === end) {
      const path = [end];
      distances[end] = 0;
      let node = currentNode;
      let distance = 1;
      while (node.previousNode !== null) {
        node = node.previousNode;
        path.push(node.index);
        distances[node.index] = distance;
        distance++;
      }

      return { path, distances };
    }

    // up
    if (index >= size) {
      queue.push({
        index: index - size,
        previousNode: currentNode,
      });
    }
    // down
    if (index < size * (size - 1)) {
      queue.push({
        index: index + size,
        previousNode: currentNode,
      });
    }
    // left
    if (index % size != 0) {
      queue.push({
        index: index - 1,
        previousNode: currentNode,
      });
    }
    // rigth
    if (index % size != size - 1) {
      queue.push({
        index: index + 1,
        previousNode: currentNode,
      });
    }
  }

  return { path: [], distances };
};

const printMap = (map: string[], path: number[] = []) => {
  const size = Math.sqrt(map.length);

  let line = "";
  map.forEach((v, i) => {
    if (i % size === 0) {
      console.log(line);
      line = "";
    }
    if (path.includes(i)) line += "O";
    else if (v === ".") line += ".";
    else line += "#";
  });
  console.log(line);
};

function part1({ path, size, distances }: DayInputType): Solution {
  const cheatLength = 2;
  let cheats = 0;
  const limit = 100;

  path.forEach((pos) => {
    // up
    if (pos >= cheatLength * size) {
      const newPos = pos - cheatLength * size;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
    // down
    if (pos < size * (size - cheatLength)) {
      const newPos = pos + cheatLength * size;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
    // left
    if (pos % size > 1) {
      const newPos = pos - cheatLength;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
    // rigth
    if (pos % size < size - cheatLength) {
      const newPos = pos + cheatLength;
      if (
        distances[newPos] > distances[pos] + cheatLength &&
        distances[newPos] - (distances[pos] + cheatLength) >= limit
      ) {
        cheats++;
      }
    }
  });

  return cheats;
}

const getNumberOfCheats = (
  cheatLength: number,
  path: number[],
  size: number,
  distances: {
    [index: string]: number;
  },
  limit: number
) => {
  let cheats = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const xfrom = path[i] % size;
    const yfrom = Math.trunc(path[i] / size);
    for (let j = i + 1; j < path.length; j++) {
      const xto = path[j] % size;
      const deltaX = Math.abs(xto - xfrom);
      if (deltaX > cheatLength) continue;

      const yto = Math.trunc(path[j] / size);
      const deltaY = Math.abs(yto - yfrom);
      if (deltaY > cheatLength) continue;

      const manhattanDistance = deltaX + deltaY;
      if (
        manhattanDistance > cheatLength ||
        distances[path[j]] - distances[path[i]] - manhattanDistance < limit
      ) {
        continue;
      }

      // console.log(`From (${from% size}, ${Math.trunc(from/ size)}) to (${to% size}, ${Math.trunc(to/ size)}): ${distances[to] - distances[from]}`);

      cheats++;
    }
  }

  return cheats;
};

function part2({ path, size, distances }: DayInputType): Solution {
  return getNumberOfCheats(20, path, size, distances, 100);
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
