import { readInput, timeIt } from "../common";
import { max } from "../lib/math";
import { type Solution } from "../types";

const year = 2017;
const day = 8;
const lines = readInput(day, year);

type DayInputType = string[][];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines.map((line) =>
    line
      .match(/(\w+) (inc|dec) (-?\d+) if (\w+) ([<>=!]+) (-?\d+)/)!
      .slice(1, 7)
  );
}

const getOperator = (operator: string) => {
  switch (operator) {
    case "==":
      return (x: number, y: number) => x == y;
    case "<=":
      return (x: number, y: number) => x <= y;
    case ">=":
      return (x: number, y: number) => x >= y;
    case "!=":
      return (x: number, y: number) => x != y;
    case "<":
      return (x: number, y: number) => x < y;
    case ">":
      return (x: number, y: number) => x > y;
  }
};

function part1(instructions: DayInputType): Solution {
  const registers: { [r: string]: number } = {};

  for (const inst of instructions) {
    const [reg, func, amount, regCond, operator, value] = inst;
    if (registers[reg] === undefined) registers[reg] = 0;
    if (registers[regCond] === undefined) registers[regCond] = 0;

    if (getOperator(operator)!(registers[regCond], parseInt(value))) {
      registers[reg] += func === "inc" ? parseInt(amount) : -parseInt(amount);
    }
  }

  return max(...Object.values(registers));
}

function part2(instructions: DayInputType): Solution {
  const registers: { [r: string]: number } = {};
  let maxValue = -1;

  for (const inst of instructions) {
    const [reg, func, amount, regCond, operator, value] = inst;
    if (registers[reg] === undefined) registers[reg] = 0;
    if (registers[regCond] === undefined) registers[regCond] = 0;

    if (getOperator(operator)!(registers[regCond], parseInt(value))) {
      registers[reg] += func === "inc" ? parseInt(amount) : -parseInt(amount);
      if (registers[reg] > maxValue) maxValue = registers[reg];
    }
  }

  return maxValue;
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
