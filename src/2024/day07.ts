import { readInput, timeIt } from "../common";
import { permutationsWithReplacement } from "../lib/math";
import { type Solution } from "../types";

const year = 2024;
const day = 7;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

const operationCheck = (
  numbers: number[],
  operators: string[],
  target: number
) => {
  let total = numbers[0];
  operators.forEach((op, i) => {
    if (total > target) return;
    if (op === "+") {
      total += numbers[i + 1];
    } else if (op === "*") {
      total *= numbers[i + 1];
    } else if (op === "||") {
      total = parseInt(`${total}${numbers[i + 1]}`);
    }
  });
  return total;
};

const checkPermutations = (
  numbers: number[],
  permutations: string[][],
  target: number
) => {
  let permutationFound = false;
  permutations.forEach((perm) => {
    if (permutationFound) return;
    const total = operationCheck(numbers, perm, target);
    if (total === target) {
      permutationFound = true;
    }
  });
  return permutationFound;
};

function part1(lines: DayInputType): Solution {
  let calibrationResult = 0;

  lines.forEach((line) => {
    const [totalString, arg] = line.split(":");
    const targetTotal = parseInt(totalString);
    const numbers = arg
      .trim()
      .split(" ")
      .map((x) => parseInt(x));

    const operatorNumber = numbers.length - 1;

    const operatorPool = ["+", "*"];

    const permutations = permutationsWithReplacement(
      operatorPool,
      operatorNumber
    );

    if (checkPermutations(numbers, permutations, targetTotal)) {
      calibrationResult += targetTotal;
    }
  });

  return calibrationResult;
}

function part2(lines: DayInputType): Solution {
  let calibrationResult = 0;

  lines.forEach((line) => {
    const [totalString, arg] = line.split(":");
    const targetTotal = parseInt(totalString);
    const numbers = arg
      .trim()
      .split(" ")
      .map((x) => parseInt(x));

    const operatorNumber = numbers.length - 1;

    const operatorPool = ["+", "*", "||"];

    const permutations = permutationsWithReplacement(
      operatorPool,
      operatorNumber
    );

    if (checkPermutations(numbers, permutations, targetTotal)) {
      calibrationResult += targetTotal;
    }
  });

  return calibrationResult;
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
