import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 17;
const lines = readInput(day, year);

type Registers = {
  a: bigint;
  b: bigint;
  c: bigint;
};
type DayInputType = {
  inst: number[];
  registers: Registers;
};

// Returns the manipulated input lines
function setup(lines: string[]) {
  const [_, rawa, rawb, rawc, rawInst] = lines
    .join("\n")
    .match(
      /^Register A\: (\d+)\WRegister B\: (\d+)\WRegister C\: (\d+)\W+Program\: ([\d,]+)$/
    )!;
  const inst = rawInst.split(",").map((x) => parseInt(x));

  let a = BigInt(parseInt(rawa));
  let b = BigInt(parseInt(rawb));
  let c = BigInt(parseInt(rawc));

  return { inst, registers: { a, b, c } };
}

const combo = (x: number, registers: Registers) => {
  if (x < 4) return BigInt(x);
  if (x == 4) return registers.a;
  if (x == 5) return registers.b;
  if (x == 6) return registers.c;
  throw new Error("Combo is 7");
};

const adv = (x: number, registers: Registers) => {
  registers.a = registers.a / 2n ** combo(x, registers);
  return 2;
};
const bdv = (x: number, registers: Registers) => {
  registers.b = registers.a / 2n ** combo(x, registers);
  return 2;
};
const cdv = (x: number, registers: Registers) => {
  registers.c = registers.a / 2n ** combo(x, registers);
  return 2;
};
const bxl = (x: number, registers: Registers) => {
  registers.b = registers.b ^ BigInt(x);
  return 2;
};
const bst = (x: number, registers: Registers) => {
  registers.b = combo(x, registers) % 8n;
  return 2;
};
const jnz = (x: number, registers: Registers) => {
  // Not actually used, implemented in doInst
  if (registers.a === 0n) return 2;
  return Number(x);
};
const bxc = (_x: number, registers: Registers) => {
  registers.b = registers.b ^ registers.c;
  return 2;
};

const out = (x: number, registers: Registers, terminal: number[]) => {
  terminal.push(Number(combo(x, registers) % 8n));
  return 2;
};

const instFunctions = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const doInst = (
  index: number,
  inst: number[],
  registers: Registers,
  terminal: number[]
) => {
  const opcode = Number(inst[index]);

  if (opcode === 3) {
    if (registers.a === 0n) return index + 2;
    return inst[index + 1];
  }

  return index + instFunctions[opcode](inst[index + 1], registers, terminal);
};

const runAllInst = (aStart: bigint, inst: number[]) => {
  const a = aStart;
  const b = 0n;
  const c = 0n;
  let index = 0;
  const terminal: number[] = [];
  const registers = { a, b, c };
  while (index >= 0 && index < inst.length - 1) {
    index = doInst(index, inst, registers, terminal);
  }

  return terminal;
};

function part1({ registers: { a }, inst }: DayInputType): Solution {
  return runAllInst(a, inst).join(",");
}

const getPossibilities = (
  seed: bigint,
  target: number,
  inst: number[],
  registers: Registers,
  terminal: number[]
) => {
  const base = seed * 8n;

  const possibilities: bigint[] = [];

  for (let k = 0; k < 8; k++) {
    const test = base + BigInt(k);

    registers.a = base + BigInt(k);
    registers.b = 0n;
    registers.c = 0n;
    let index = 0;
    terminal = [];
    while (index < inst.length - 3) {
      index = doInst(index, inst, registers, terminal);
    }

    if (terminal[0] === target) {
      possibilities.push(test);
    }
  }

  return possibilities;
};

type Test = [bigint, number];

function part2({ inst, registers }: DayInputType): Solution {
  const toCheck: Test[] = [[0n, 0]];

  const answers = [];

  while (toCheck.length > 0) {
    const [current, index] = toCheck.pop()!;

    if (index === inst.length) {
      answers.push(Number(current));
    }

    const possibilities = getPossibilities(
      current,
      inst[inst.length - 1 - index],
      inst,
      registers,
      []
    );

    const next = possibilities.map((n) => [n, index + 1]) as Test[];
    toCheck.push(...next);
  }

  return Math.min(...answers);
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
