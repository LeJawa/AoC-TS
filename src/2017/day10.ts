import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 10;
const lines = readInput(day, year);

type DayInputType = string;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0];
}

function tie_knot(loop: number[], current: number, length: number) {
  const end = current + length;
  let subloop = loop.slice(current, end).map((c, i) => [i + current, c]);

  if (end >= loop.length)
    subloop.push(...loop.slice(0, end - loop.length).map((c, i) => [i, c]));

  for (let i = subloop.length - 1; i >= 0; i--) {
    loop[subloop[subloop.length - i - 1][0]] = subloop[i][1];
  }

  return loop;
}

function tie_n_knots(n: number, loop: number[], lengths: number[]) {
  let current = 0;
  let skip = 0;

  for (let i = 0; i < n; i++) {
    for (const length of lengths) {
      loop = tie_knot(loop, current, length);
      current = (current + length + skip) % loop.length;
      skip++;
    }
  }

  return loop;
}

function get_dense_hash(sparse_hash: number[]) {
  const hash_numbers: number[] = [];
  let i = 0;

  while (i < sparse_hash.length) {
    hash_numbers.push(
      sparse_hash[i] ^
        sparse_hash[i + 1] ^
        sparse_hash[i + 2] ^
        sparse_hash[i + 3] ^
        sparse_hash[i + 4] ^
        sparse_hash[i + 5] ^
        sparse_hash[i + 6] ^
        sparse_hash[i + 7] ^
        sparse_hash[i + 8] ^
        sparse_hash[i + 9] ^
        sparse_hash[i + 10] ^
        sparse_hash[i + 11] ^
        sparse_hash[i + 12] ^
        sparse_hash[i + 13] ^
        sparse_hash[i + 14] ^
        sparse_hash[i + 15]
    );

    i += 16;
  }

  return hash_numbers.map((x) => x.toString(16).padStart(2, "0")).join("");
}

function part1(input: DayInputType): Solution {
  const lengths = input.split(",").map((s) => parseInt(s));
  let loop = Array(256)
    .fill(0)
    .map((_, i) => i);

  loop = tie_n_knots(1, loop, lengths);

  return `${loop[0] * loop[1]}`;
}

export function knotHash(input: string) {
  const lengths = Array.from(input)
    .map((c) => c.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);

  let loop = Array(256)
    .fill(0)
    .map((_, i) => i);

  loop = tie_n_knots(64, loop, lengths);

  const result = get_dense_hash(loop);

  return result;
}

function part2(input: DayInputType): Solution {
  return knotHash(input);
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
