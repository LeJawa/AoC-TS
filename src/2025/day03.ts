import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2025;
const day = 3;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

function part1(batteryBanks: DayInputType): Solution {
  let totalJoltage = 0;

  batteryBanks.forEach((bank) => {
    let left = bank[0];
    let right = bank[bank.length - 1];
    for (let i = 1; i < bank.length; i++) {
      if (left < bank[i] && i < bank.length - 1) {
        left = bank[i];
        right = bank[i + 1];
      } else if (right < bank[i]) {
        right = bank[i];
      }
    }

    const joltage = parseInt(left) * 10 + parseInt(right);
    totalJoltage += joltage;
  });

  return totalJoltage;
}

function part2(batteryBanks: DayInputType): Solution {
  let totalJoltage = 0;
  const size = 12;

  const batteries = new Array(size).fill(0);
  let lastDigits = new Array(size).fill(0);
  batteryBanks.forEach((bank) => {
    batteries.map((_, i) => bank[i]);
    lastDigits.map((_, i) => i);

    for (let i = 1; i < bank.length; i++) {
      for (let j = 0; j < size; j++) {
        if (
          batteries[j] < bank[i] &&
          i > j - 1 &&
          i <= bank.length - size + j &&
          lastDigits[j] < i
        ) {
          batteries[j] = bank[i];
          lastDigits[j] = i;
          for (let k = 1; k < size - j; k++) {
            batteries[j + k] = bank[i + k];
            lastDigits[j + k] = i + k;
          }
          break;
        }
      }
    }

    let joltage = 0;
    for (let i = 0; i < size; i++) {
      joltage += parseInt(batteries[i]) * 10 ** (size - i - 1);
    }

    totalJoltage += joltage;
  });

  return totalJoltage;
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
