import fs from "fs";
import path from "path";
import { timeIt } from "./common";

const [, , ...args] = process.argv;
const year = new Date().getFullYear();

function getDayFiles(year: number) {
  const daysDir = path.join(__dirname, `${year}`);
  return fs
    .readdirSync(daysDir)
    .filter((f) => /^day\d{2}\.(?:ts|js)$/.test(f))
    .sort();
}

function getYearsAvailable() {
  return fs
    .readdirSync(__dirname)
    .filter((f) => /^\d{4}$/.test(f))
    .map((y) => parseInt(y))
    .sort();
}

async function runDay(day: number, year: number) {
  const file = path.join(
    __dirname,
    `${year}`,
    `day${day.toString().padStart(2, "0")}.js`
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

const printUsage = () => {
  console.log("Usage: pnpm start <day> <year>| <year> | --all");
};

async function main(...args: string[]) {
  if (args.length > 2) {
    printUsage();
    return;
  }

  const day = /^\d{1,2}$/.test(args[0])
    ? parseInt(args[0])
    : /^\d{1,2}$/.test(args[1])
    ? parseInt(args[1])
    : undefined;

  const year = /^\d{4}$/.test(args[0])
    ? parseInt(args[0])
    : /^\d{4}$/.test(args[1])
    ? parseInt(args[1])
    : undefined;

  const isAll = args[0] === "--all";

  if (isAll) {
    const years = getYearsAvailable();

    const { time } = await timeIt(async () => {
      for (const y of years) {
        console.log(`${y}`);
        const files = getDayFiles(y);
        for (const f of files) {
          const day = parseInt(f.match(/\d{2}/)![0]);
          await runDay(day, y);
        }
        console.log("============================");
      }
    });

    console.log(`\nTotal time: ${time}`);
  } else if (!!year && !day) {
    const files = getDayFiles(year);

    const { time } = await timeIt(async () => {
      for (const f of files) {
        const day = parseInt(f.match(/\d{2}/)![0]);
        await runDay(day, year);
      }
    });

    console.log(`\nTotal time: ${time}`);
  } else if (!!year && !!day) {
    await runDay(day, year);
  } else {
    printUsage();
    return;
  }
}

main(...args);
