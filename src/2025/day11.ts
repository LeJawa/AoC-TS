import { log } from "console";
import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 11;

const IS_RAW_INPUT = false; // set to true if lines is raw input
const lines = readInput(day, year, IS_RAW_INPUT);

type DayInputType = ReturnType<typeof setup>;

// Returns the manipulated input lines
function setup(lines: string[]) {
  const graph: { [node: string]: string[] } = {};

  for (const line of lines) {
    const split = line.split(": ");
    const nodeIn = split[0];

    graph[nodeIn] = split[1].split(" ");
  }
  graph["out"] = [];
  return graph;
}

const getPathCount = (
  graph: DayInputType,
  nodeIn: string,
  nodeOut: string,
  filter: Set<string> = null!
) => {
  const nextNodes = graph[nodeIn].map((n) => ({
    node: n,
    visited: new Set<string>(),
  }));

  let pathCount = 0;

  while (nextNodes.length > 0) {
    const { node, visited } = nextNodes.pop()!;

    if (visited.has(node)) {
      // log(`Visited ${node}`);
      continue;
    }

    if (!!filter && !filter.has(node)) {
      continue;
    }

    if (node === nodeOut) {
      pathCount++;
      continue;
    }

    // log(`${node} => ${graph[node]}`);

    nextNodes.push(
      ...graph[node].map((n) => ({
        node: n,
        visited: new Set<string>([...visited, node]),
      }))
    );
  }

  return pathCount;
};

function part1(graph: DayInputType): Solution {
  return getPathCount(graph, "you", "out");
}

function part2(graph: DayInputType): Solution {
  const fftAscendants = new Set<string>();

  const pool = ["fft"];
  const visited = new Set<string>();

  while (pool.length > 0) {
    const node = pool.pop()!;

    if (visited.has(node)) continue;

    fftAscendants.add(node);
    visited.add(node);
    pool.push(...Object.keys(graph).filter((key) => graph[key].includes(node)));
  }

  const dacAscendants = new Set<string>();

  pool.push("dac");
  visited.clear();

  while (pool.length > 0) {
    const node = pool.pop()!;

    if (visited.has(node) || node === "fft" || fftAscendants.has(node))
      continue;

    dacAscendants.add(node);
    visited.add(node);
    pool.push(...Object.keys(graph).filter((key) => graph[key].includes(node)));
  }

  const outAscendants = new Set<string>();

  pool.push("out");
  visited.clear();

  while (pool.length > 0) {
    const node = pool.pop()!;

    if (
      visited.has(node) ||
      node === "dac" ||
      fftAscendants.has(node) ||
      dacAscendants.has(node)
    )
      continue;

    outAscendants.add(node);
    visited.add(node);
    pool.push(...Object.keys(graph).filter((key) => graph[key].includes(node)));
  }

  return (
    getPathCount(graph, "svr", "fft", fftAscendants) *
    getPathCount(graph, "fft", "dac", dacAscendants) *
    getPathCount(graph, "dac", "out", outAscendants)
  );
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
