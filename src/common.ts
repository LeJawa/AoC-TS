import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

export function timeIt<T>(fn: () => T): { result: T; time: string } {
  const start = process.hrtime.bigint();
  const result = fn();
  const end = process.hrtime.bigint();
  const ms = Number(end - start) / 1e6;
  const time = ms < 1000 ? `${ms.toFixed(2)}ms` : `${(ms / 1000).toFixed(2)}s`;
  return { result, time };
}

export async function downloadInput(
  day: number,
  year: number,
  dest: string
): Promise<void> {
  const session = process.env.AOC_SESSION;
  if (!session) throw new Error("AOC_SESSION not set in .env");
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const res = await fetch(url, {
    headers: { Cookie: `session=${session}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch input: ${res.status}`);
  const text = await res.text();
  fs.writeFileSync(dest, text);
}

export function readInput(day: number, year: number): string[] {
  const file = path.join(
    __dirname,
    "..",
    "inputs",
    `day${day.toString().padStart(2, "0")}.txt`
  );
  return fs.readFileSync(file, "utf-8").split(/\r?\n/);
}
