import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const year = new Date().getFullYear();
const [, , arg] = process.argv;

function getDayFiles() {
  const daysDir = path.join(__dirname, "days");
  return fs
    .readdirSync(daysDir)
    .filter((f) => /^day\d{2}\.ts$/.test(f))
    .sort();
}

async function runDay(day: number) {
  const file = path.join(
    __dirname,
    "days",
    `day${day.toString().padStart(2, "0")}.ts`
  );
  if (!fs.existsSync(file)) {
    console.log(`No solution for day ${day}`);
    return;
  }
  // Dynamically import the day's module and run its main function
  try {
    const dayModule = await import("file://" + file);
    if (typeof dayModule.main === "function") {
      await dayModule.main();
    } else {
      console.error(
        `No exported 'main' function found in day${day
          .toString()
          .padStart(2, "0")}.ts`
      );
    }
  } catch (err) {
    console.error(`Error running day ${day}:`, err);
  }
}

async function main() {
  if (arg === "--all") {
    const files = getDayFiles();
    for (const f of files) {
      const day = parseInt(f.match(/\d{2}/)![0], 10);
      await runDay(day);
    }
  } else if (/^\d{1,2}$/.test(arg)) {
    await runDay(parseInt(arg, 10));
  } else if (/^\d{4}$/.test(arg)) {
    console.log("Year support not implemented yet.");
  } else {
    console.log("Usage: ts-node src/runner.ts <day>|<year>|--all");
  }
}

main();
