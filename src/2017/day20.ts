import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 20;
const lines = readInput(day, year);

type DayInputType = {
  p: number[];
  v: number[];
  a: number[];
  alive: boolean;
}[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines
    .map(
      (line) =>
        /p=<(-?\d+,-?\d+,-?\d+)>, v=<(-?\d+,-?\d+,-?\d+)>, a=<(-?\d+,-?\d+,-?\d+)>/.exec(
          line
        )!
    )
    .map((regex) => {
      return {
        p: regex[1].split(",").map((x) => parseInt(x)),
        v: regex[2].split(",").map((x) => parseInt(x)),
        a: regex[3].split(",").map((x) => parseInt(x)),
        alive: true,
      };
    });
}

const manhattanDistance = (p: number[]) =>
  Math.abs(p[0]) + Math.abs(p[1]) + Math.abs(p[2]);

const longTime = 1e6;

function part1(particles: DayInputType): Solution {
  let closestParticle = -1;
  let minPosition = Infinity;

  particles.forEach(({ p, v, a }, i) => {
    const longTermP = p.map(
      (p0, i) => p0 + longTime * v[i] + a[i] * (longTime * (longTime + 1))
    );

    const distance = manhattanDistance(longTermP);
    if (distance < minPosition) {
      minPosition = distance;
      closestParticle = i;
    }
  });

  return closestParticle;
}

function part2(particles: DayInputType): Solution {
  for (let i = 0; i < 100; i++) {
    const positions = new Set<string>();
    const posMap: { [pString: string]: number } = {};
    particles.forEach(({ p, v, a, alive }, i) => {
      if (!alive) return;

      v[0] += a[0];
      v[1] += a[1];
      v[2] += a[2];
      p[0] += v[0];
      p[1] += v[1];
      p[2] += v[2];

      const pString = p.toString();
      if (positions.has(pString)) {
        particles[i].alive = false;
        particles[posMap[pString]].alive = false;
      } else {
        positions.add(pString);
        posMap[pString] = i;
      }
    });
  }

  return particles.filter(({ alive }) => alive).length;
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
