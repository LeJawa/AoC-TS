import fs from "fs";
import path from "path";

export async function timeIt<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; time: string }> {
  const start = process.hrtime.bigint();
  let result: T;
  if (fn.constructor.name === "AsyncFunction") {
    result = await (fn() as Promise<T>);
  } else {
    const maybePromise = fn();
    if (maybePromise instanceof Promise) {
      result = await maybePromise;
    } else {
      result = maybePromise;
    }
  }
  const end = process.hrtime.bigint();
  const ms = Number(end - start) / 1e6;
  const time = ms < 1000 ? `${ms.toFixed(2)}ms` : `${(ms / 1000).toFixed(2)}s`;
  return { result, time };
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
