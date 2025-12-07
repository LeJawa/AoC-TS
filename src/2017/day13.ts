import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 13;
const lines = readInput(day, year);

type DayInputType = {
  [depth: number]: number;
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  const scanners: { [depth: number]: number } = {};

  for (const line of lines) {
    const [depth, range] = line.split(": ");

    scanners[parseInt(depth)] = parseInt(range);
  }

  return scanners;
}

const maxDepth = 100;

const getSeverityOfTrip = (
  scanners: DayInputType,
  delay: number,
  breakOnCaught = false
) => {
  let severity = 0;

  for (let i = 0; i < maxDepth; i++) {
    const range = scanners[i];

    if (range === undefined) continue;
    if ((i + delay) % (2 * (range - 1)) == 0) {
      if (breakOnCaught) return Infinity;
      severity += i * range;
    }
  }

  return severity;
};

function part1(scanners: DayInputType): Solution {
  const severity = getSeverityOfTrip(scanners, 0);
  return "t=0 Severity: " + severity;
}

function part2(scanners: DayInputType): Solution {
  let severity = 1;
  let delay = 0;
  while (severity !== 0) {
    delay++;
    severity = getSeverityOfTrip(scanners, delay, true);
  }

  return `Delay: ${delay}ps`;
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
