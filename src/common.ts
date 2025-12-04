import fs from "fs";
import path from "path";

export async function timeIt<T>(
  fn: () => T | Promise<T>,
  times: number = 1
): Promise<{ result: T; time: string; ns: number }> {
  const start = process.hrtime.bigint();
  let result: T = undefined!;
  if (fn.constructor.name === "AsyncFunction") {
    for (let _ = 0; _ < times; _++) {
      result = await (fn() as Promise<T>);
    }
  } else {
    for (let _ = 0; _ < times; _++) {
      const maybePromise = fn();
      if (maybePromise instanceof Promise) {
        result = await maybePromise;
      } else {
        result = maybePromise;
      }
    }
  }
  const end = process.hrtime.bigint();
  const ns = Number(end - start) / times;
  return { result, time: formatTime(ns), ns };
}

export function formatTime(ns: number) {
  return ns < 1000
    ? `${ns}ns`
    : ns < 1e6
    ? `${(ns / 1000).toFixed(2)}µs`
    : ns < 1e9
    ? `${(ns / 1e6).toFixed(2)}ms`
    : ns < 60e9
    ? `${(ns / 1e9).toFixed(2)}s`
    : `${Math.floor(ns / 60e9)}m${((ns / 1e9) % 60).toFixed(2)}s`;
}

export function readInput(day: number, year: number): string[] {
  const file = path.join(
    __dirname,
    "..",
    "inputs",
    year.toString(),
    `day${day.toString().padStart(2, "0")}.txt`
  );
  return fs
    .readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line !== "");
}
