import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 25;
const lines = readInput(day, year);

type DayInputType = {
  steps: number;
  doStep: (
    tape: {
      [pos: number]: 1 | 0;
    },
    pos: number,
    state: string
  ) => void;
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const joinedLines = lines.join("\n");

  const steps = parseInt(/(\d+) steps/.exec(joinedLines)![1]);

  const stateMatches = joinedLines.matchAll(
    /In state (\w):.*?Write the value ([10]).*?to the (right|left).*?state (\w).*?Write the value ([10]).*?to the (right|left).*?state (\w)/gms
  );

  const states: {
    [state: string]: {
      0: { value: 1 | 0; nextPos: string; nextState: string };
      1: { value: 1 | 0; nextPos: string; nextState: string };
    };
  } = {};

  for (const match of stateMatches) {
    states[match[1]] = {
      0: {
        value: match[2] === "0" ? 0 : 1,
        nextPos: match[3],
        nextState: match[4],
      },
      1: {
        value: match[5] === "0" ? 0 : 1,
        nextPos: match[6],
        nextState: match[7],
      },
    };
  }

  const doStep = (
    tape: { [pos: number]: 1 | 0 },
    pos: number,
    state: string
  ) => {
    if (tape[pos] === undefined) tape[pos] = 0;

    const { value, nextPos, nextState } = states[state][tape[pos]];
    tape[pos] = value;
    state = nextState;
    pos += nextPos === "right" ? 1 : -1;
  };

  return { steps, doStep };
}

function part1({ steps, doStep }: DayInputType): Solution {
  const tape: { [pos: number]: 1 | 0 } = { 0: 0 };
  let state = "A";
  let pos = 0;

  for (let i = 0; i < steps; i++) {
    doStep(tape, pos, state);
  }

  return Object.values(tape).reduce((sum, value) => sum + value, 0 as number);
}

function part2(_: DayInputType): Solution {
  return "Congratulations! You saved x-mas!";
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
