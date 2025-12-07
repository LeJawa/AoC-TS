import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 24;
const lines = readInput(day, year);

type DayInputType = () => {
  [type: string]: number[];
};

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return () => {
    const connectorDict: { [type: string]: number[] } = {};
    for (const line of lines) {
      const [a, b] = line.split("/");
      if (connectorDict[a] === undefined) connectorDict[a] = [];
      connectorDict[a].push(parseInt(b));
      if (a === b) continue;
      if (connectorDict[b] === undefined) connectorDict[b] = [];
      connectorDict[b].push(parseInt(a));
    }
    return connectorDict;
  };
}

const connectNext = (
  dict: ReturnType<DayInputType>,
  bridge: [number, number][] = [[0, 0]],
  output: { maxStrength: number; maxLength: number } = {
    maxStrength: 0,
    maxLength: null!,
  }
) => {
  const { maxStrength, maxLength } = output;
  const typeA = bridge[bridge.length - 1][1];
  const connectors = dict[typeA].filter((typeB) =>
    bridge.every(
      ([a, b]) =>
        !((a === typeA && b === typeB) || (a === typeB && b === typeA))
    )
  );
  if (connectors.length === 0) {
    const strength = bridge.reduce((s, [a, b]) => (s += a + b), 0);
    if (maxLength !== null) {
      if (bridge.length < maxLength) return { maxStrength, maxLength };
      if (bridge.length > maxLength)
        return { maxStrength: strength, maxLength: bridge.length };
    }
    if (strength > maxStrength) return { maxStrength: strength, maxLength };
    else return { maxStrength, maxLength };
  }

  for (const typeB of connectors) {
    output = connectNext(dict, [...bridge, [typeA, typeB]], output);
  }

  return output;
};

function part1(getConnectorDict: DayInputType): Solution {
  return connectNext(getConnectorDict()).maxStrength;
}

function part2(getConnectorDict: DayInputType): Solution {
  return connectNext(getConnectorDict(), [[0, 0]], {
    maxStrength: 0,
    maxLength: 0,
  }).maxStrength;
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
