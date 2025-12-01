import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2017;
const day = 16;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0].split(",");
}

const letter2position: { [letter: string]: number } = {};
const position2letter: { [position: number]: string } = {};

const spin = (length: number) => {
  Object.keys(letter2position).forEach((l) => {
    letter2position[l] = (letter2position[l] + length) % 16;
    position2letter[letter2position[l]] = l;
  });
};

const exchange = (pos1: number, pos2: number) => {
  const tmpLetter = position2letter[pos1];

  position2letter[pos1] = position2letter[pos2];
  position2letter[pos2] = tmpLetter;

  letter2position[position2letter[pos1]] = pos1;
  letter2position[position2letter[pos2]] = pos2;
};

const partner = (letter1: string, letter2: string) => {
  const tmpPos = letter2position[letter1];

  letter2position[letter1] = letter2position[letter2];
  letter2position[letter2] = tmpPos;

  position2letter[letter2position[letter1]] = letter1;
  position2letter[letter2position[letter2]] = letter2;
};

const getDancefloor = () => {
  let s = "";
  for (let i = 0; i < 16; i++) {
    s += position2letter[i];
  }

  return s;
};

const resetDancefloor = () => {
  for (let i = 0; i < 16; i++) {
    const letter = String.fromCharCode(97 + i);

    letter2position[letter] = i;
    position2letter[i] = letter;
  }
};

const executeMoves = (moves: DayInputType) => {
  moves.forEach((move) => {
    if (move[0] === "s") spin(parseInt(move.slice(1)));
    else if (move[0] === "p") partner(move[1], move[3]);
    else {
      const r = /x(\d+)\/(\d+)/.exec(move)!;
      exchange(parseInt(r[1]), parseInt(r[2]));
    }
  });
};

function part1(moves: DayInputType): Solution {
  resetDancefloor();
  executeMoves(moves);

  return getDancefloor();
}
function part2(moves: DayInputType): Solution {
  resetDancefloor();

  const danceFloorsReached = new Set([getDancefloor()]);
  let cycle = Infinity;

  for (let n = 0; n < 1e9; n++) {
    executeMoves(moves);

    const dancefloor = getDancefloor();
    if (!danceFloorsReached.has(dancefloor)) {
      danceFloorsReached.add(dancefloor);
      continue;
    }

    cycle = n + 1;
    break;
  }

  const remaining = 1e9 % cycle;

  for (let n = 0; n < remaining; n++) {
    moves.forEach((move) => {
      if (move[0] === "s") spin(parseInt(move.slice(1)));
      else if (move[0] === "p") partner(move[1], move[3]);
      else {
        const r = /x(\d+)\/(\d+)/.exec(move)!;
        exchange(parseInt(r[1]), parseInt(r[2]));
      }
    });
  }

  return getDancefloor();
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
