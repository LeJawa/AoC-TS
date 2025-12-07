import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 18;
const lines = readInput(day, year);

type DayInputType = number[];

const size = 71;

const start = 0;
const end = size * size - 1;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) => {
    const [x, y] = line.split(",");
    return parseInt(x) + size * parseInt(y);
  });
}

const fillMapWithBytes = (
  start: number,
  n: number,
  bytes: number[],
  map: boolean[] = undefined!
) => {
  map ??= new Array<boolean>(size * size).fill(true);
  for (let i = 0; i < n; i++) {
    map[bytes[start + i]] = false;
  }

  return map;
};

const printMap = (map: boolean[], path: number[] = []) => {
  let line = "";
  map.forEach((v, i) => {
    if (i % size === 0) {
      console.log(line);
      line = "";
    }
    if (path.includes(i)) line += "O";
    else if (v) line += ".";
    else line += "#";
  });
  console.log(line);
};

interface Node {
  index: number;
  previousNode: Node;
}

const bfs = (start: number, end: number, map: boolean[]) => {
  const queue: Node[] = [];
  queue.push({ index: start, previousNode: null! });

  const visited = new Set<number>();

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const { index } = currentNode;

    if (!map[index] || visited.has(index)) continue;
    visited.add(index);

    if (index === end) {
      const path = [end];
      let node = currentNode;
      while (node.previousNode !== null) {
        node = node.previousNode;
        path.push(node.index);
      }

      return path;
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

  return [];
};

function part1(bytes: DayInputType): Solution {
  const map = fillMapWithBytes(0, 1024, bytes);
  // printMap();
  const path = bfs(start, end, map)!;
  return path.length - 1;
}

function part2(bytes: DayInputType): Solution {
  let byteIndex = 1024;
  let map = fillMapWithBytes(0, 1024, bytes);

  let path = bfs(start, end, map)!;
  while (path.length !== 0) {
    // printMap(path);
    map = fillMapWithBytes(++byteIndex, 1, bytes, map);
    if (!path.includes(bytes[byteIndex])) continue;
    path = bfs(start, end, map)!;
  }

  return `${bytes[byteIndex] % size},${Math.trunc(bytes[byteIndex] / size)}`;
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
