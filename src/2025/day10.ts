import { readInput, timeIt } from "../common";
import { combinationsWithReplacement } from "../lib/math";
import { type Solution } from "../types";

const year = 2025;
const day = 10;

const IS_RAW_INPUT = false; // set to true if lines is raw input
const lines = readInput(day, year, IS_RAW_INPUT);

type DayInputType = ReturnType<typeof setup>;

// Returns the manipulated input lines
function setup(lines: string[]) {
  const machines = lines
    .map((line) => /\[(.*)\]/.exec(line)![1])
    .map((s) => s.split("").map((c) => (c === "." ? false : true)));
  const buttons = lines
    .map((line) => /\] (.*) \{/.exec(line)![1])
    .map((s) =>
      s
        .split(" ")
        .map((s) => s.slice(1, -1))
        .map((b) => b.split(",").map((i) => parseInt(i)))
    );
  const energy = lines
    .map((line) => /\{(.*)\}/.exec(line)![1])
    .map((s) => s.split(",").map((c) => parseInt(c)));

  return { machines, buttons, energy };
}

function part1({ machines, buttons }: DayInputType): Solution {
  let buttonPresses = 0;

  for (let i = 0; i < machines.length; i++) {
    let minPresses = -1;
    const m: boolean[] = Array(machines[i].length).fill(false);

    for (let k = 1; minPresses < 1; k++) {
      const combinations = combinationsWithReplacement(buttons[i], k);

      for (const c of combinations) {
        m.fill(false);
        for (const b of c) {
          b.forEach((i) => {
            m[i] = !m[i];
          });
        }
        if (m.every((l, light) => l === machines[i][light])) {
          minPresses = k;
          break;
        }
      }
    }

    buttonPresses += minPresses;
  }
  return buttonPresses;
}

function part2({ buttons, energy }: DayInputType): Solution {
  let buttonPresses = 0;

  for (let i = 0; i < energy.length; i++) {
    let minPresses = -1;
    const m: number[] = Array(energy[i].length).fill(0);

    for (let k = 1; minPresses < 1; k++) {
      const combinations = combinationsWithReplacement(buttons[i], k);

      for (const c of combinations) {
        m.fill(0);
        for (const b of c) {
          b.forEach((i) => {
            m[i] += 1;
          });
        }
        if (m.every((l, light) => l === energy[i][light])) {
          minPresses = k;
          break;
        }
      }
    }

    buttonPresses += minPresses;
  }
  return buttonPresses;
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
