import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 8;

const IS_RAW_INPUT = false; // set to true if lines is raw input
const lines = readInput(day, year, IS_RAW_INPUT);

type DayInputType = {
  [key: string]: number[];
};

// Returns the manipulated input lines
function setup(lines: string[]) {
  const positions = lines.map((line) =>
    line.split(",").map((x) => parseInt(x))
  );

  const boxes: { [key: string]: number[] } = {};
  positions.forEach((position) => {
    boxes[position.toString()] = position;
  });

  return boxes;
}

const getDistance = (a: number[], b: number[]) => {
  return (
    (b[0] - a[0]) * (b[0] - a[0]) +
    (b[1] - a[1]) * (b[1] - a[1]) +
    (b[2] - a[2]) * (b[2] - a[2])
  );
};

const findSmallestDistance = (distances: {
  [fromBox: string]: { [toBox: string]: number };
}) => {
  let minDist = Infinity;
  let from = "",
    to = "";

  for (const f in distances) {
    for (const t in distances[f]) {
      if (!!distances[f][t] && distances[f][t] < minDist) {
        minDist = distances[f][t];
        from = f;
        to = t;
      }
    }
  }

  return [from, to];
};

type Distance = {
  nodeA: string;
  nodeB: string;
  value: number;
};

const addToShortestDistances = (
  distance: Distance,
  shortestDistances: Distance[],
  N: number
) => {
  if (shortestDistances.length < N) {
    shortestDistances.push(distance);
    shortestDistances.sort((a, b) => a.value - b.value);
    return shortestDistances;
  }

  const index = shortestDistances.findIndex((d, i, arr) => {
    return (
      distance.value > d.value &&
      distance.value < (arr[i + 1] ?? { value: Infinity }).value
    );
  });

  const unsorted = shortestDistances
    .slice(0, index + 1)
    .concat(distance)
    .concat(shortestDistances.slice(index + 1, N - 1));

  return unsorted.toSorted((a, b) => a.value - b.value);
};

function part1(boxes: DayInputType): Solution {
  // return 131580;
  const N = 1000;
  const distances: { [fromBox: string]: { [toBox: string]: number } } = {};
  let shortestDistances: Distance[] = [];

  for (const from in boxes) {
    if (distances[from] === undefined) distances[from] = {};
    for (const to in boxes) {
      if (from === to) continue;
      if (distances[to] && distances[to][from] !== undefined) continue;

      distances[from][to] = getDistance(boxes[from], boxes[to]);

      shortestDistances = addToShortestDistances(
        {
          nodeA: from,
          nodeB: to,
          value: distances[from][to],
        },
        shortestDistances,
        N
      );
    }
  }
  const graphs: Set<string>[] = [];

  for (let j = 0; j < N; j++) {
    console.log(j);

    const { nodeA, nodeB } = shortestDistances[j];

    let addedToGraph = false;
    let toDelete = -1;
    for (const graph of graphs) {
      if (graph.has(nodeA)) {
        for (let i = 0; i < graphs.length; i++) {
          if (graphs[i] === graph) continue;
          if (graphs[i].has(nodeB)) {
            for (const f of graphs[i].values()) {
              graph.add(f);
            }
            toDelete = i;
            break;
          }
        }

        graph.add(nodeB);
        addedToGraph = true;
        break;
      }
      if (graph.has(nodeB)) {
        for (let i = 0; i < graphs.length; i++) {
          if (graphs[i] === graph) continue;
          if (graphs[i].has(nodeA)) {
            for (const t of graphs[i].values()) {
              graph.add(t);
            }
            toDelete = i;
            break;
          }
        }

        graph.add(nodeA);
        addedToGraph = true;
        break;
      }
    }
    if (!addedToGraph) {
      graphs.push(new Set([nodeA, nodeB]));
    } else if (toDelete !== -1) {
      graphs.splice(toDelete, 1);
    }

    // console.log(`${from} => ${to}`);

    // console.log(graphs);
  }

  const sorted = graphs.toSorted((a, b) => b.size - a.size);
  console.log(sorted.slice(0, 3));
  return sorted[0].size * sorted[1].size * sorted[2].size;
}

function part2(boxes: DayInputType): Solution {
  const distances: { [fromBox: string]: { [toBox: string]: number } } = {};

  for (const from in boxes) {
    if (distances[from] === undefined) distances[from] = {};
    for (const to in boxes) {
      if (from === to) continue;
      if (distances[to] && distances[to][from] !== undefined) continue;

      distances[from][to] = getDistance(boxes[from], boxes[to]);
    }
  }
  const graphs: Set<string>[] = [];
  let startChecking = false;

  let i = 0;
  while (true) {
    console.log(i++, graphs.length);

    const [from, to] = findSmallestDistance(distances);
    distances[from][to] = Infinity;
    distances[to][from] = Infinity;

    let addedToGraph = false;
    let toDelete = -1;
    for (const graph of graphs) {
      if (graph.has(from)) {
        for (let i = 0; i < graphs.length; i++) {
          if (graphs[i] === graph) continue;
          if (graphs[i].has(to)) {
            for (const f of graphs[i].values()) {
              graph.add(f);
            }
            toDelete = i;
            break;
          }
        }

        graph.add(to);
        addedToGraph = true;
        break;
      }
      if (graph.has(to)) {
        for (let i = 0; i < graphs.length; i++) {
          if (graphs[i] === graph) continue;
          if (graphs[i].has(from)) {
            for (const t of graphs[i].values()) {
              graph.add(t);
            }
            toDelete = i;
            break;
          }
        }

        graph.add(from);
        addedToGraph = true;
        break;
      }
    }
    if (!addedToGraph) {
      graphs.push(new Set([from, to]));
    } else if (toDelete !== -1) {
      graphs.splice(toDelete, 1);

      if (graphs.length === 1) {
        return parseInt(from.split(",")[0]) * parseInt(to.split(",")[0]);
      }
    }

    // console.log(`${from} => ${to}`);

    // console.log(graphs);
  }
}

export async function main() {
  console.log(`Day ${day}:`);

  const { result: dayInput, time: time0 } = await timeIt(() => setup(lines));
  console.log(` > Setup (${time0})`);

  const { result: answer1, time: time1 } = await timeIt(() => part1(dayInput));
  console.log(` > Part 1:`, answer1, `(${time1})`);

  // const { result: answer2, time: time2 } = await timeIt(() => part2(dayInput));
  // console.log(` > Part 2:`, answer2, `(${time2})`);
}

export { setup, part1, part2, IS_RAW_INPUT };
