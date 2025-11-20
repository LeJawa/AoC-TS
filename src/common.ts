import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function timeIt<T>(fn: () => T): { result: T; time: string } {
  const start = process.hrtime.bigint();
  const result = fn();
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
    `day${day.toString().padStart(2, "0")}.txt`
  );
  return fs
    .readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
}
