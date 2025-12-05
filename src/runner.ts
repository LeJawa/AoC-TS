import fs from "fs";
import path from "path";
import { formatTime, readInput, timeIt } from "./common";

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

async function runDay(day: number, year: number, times: number) {
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

    if (times === 1) {
      if (typeof dayModule.main === "function") {
        await dayModule.main();
      } else {
        console.error(
          `No exported 'main' function found in day${day
            .toString()
            .padStart(2, "0")}.ts`
        );
      }
    } else if (times < 1) {
      console.error(
        `Cannot execute the functions less than 1 times (${times})`
      );
    } else {
      let importError = false;
      if (typeof dayModule.setup !== "function") {
        importError = true;
        console.error(
          `No exported 'setup' function found in day${day
            .toString()
            .padStart(2, "0")}.ts`
        );
      }
      if (typeof dayModule.part1 !== "function") {
        importError = true;
        console.error(
          `No exported 'part1' function found in day${day
            .toString()
            .padStart(2, "0")}.ts`
        );
      }
      if (typeof dayModule.part2 !== "function") {
        importError = true;
        console.error(
          `No exported 'part2' function found in day${day
            .toString()
            .padStart(2, "0")}.ts`
        );
      }

      if (importError) throw new Error("Error with imports");

      const lines = readInput(day, year);
      console.log(`Day ${day}:`);

      const { result: dayInput, time: time0 } = await timeIt(
        () => dayModule.setup(lines),
        times
      );
      console.log(` > Setup (${time0}, x${times})`);

      const { result: answer1, time: time1 } = await timeIt(
        () => dayModule.part1(dayInput),
        times
      );
      console.log(` > Part 1:`, answer1, `(${time1}, x${times}))`);

      const { result: answer2, time: time2 } = await timeIt(
        () => dayModule.part2(dayInput),
        times
      );
      console.log(` > Part 2:`, answer2, `(${time2}, x${times}))`);
    }
  } catch (err) {
    console.error(`Error running day ${day}:`, err);
  }
}

const printUsage = () => {
  console.log("Usage: pnpm start <day> <year> | <year> | --all [--times X]");
};

async function main(...args: string[]) {
  // if (args.length > 2) {
  //   printUsage();
  //   return;
  // }

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

  const timesArgIndex = args.indexOf("--times");
  const rawTimes = timesArgIndex > 0 ? args[timesArgIndex + 1] : undefined;

  const times = rawTimes !== undefined ? parseInt(rawTimes) : 1;
  if (!!times && isNaN(times)) {
    printUsage();
    return;
  }

  if (isAll) {
    const years = getYearsAvailable();

    const { ns } = await timeIt(async () => {
      for (const y of years) {
        console.log(`${y}`);
        const files = getDayFiles(y);
        for (const f of files) {
          const day = parseInt(f.match(/\d{2}/)![0]);
          await runDay(day, y, times);
        }
        console.log("============================");
      }
    });

    console.log(`\nTotal time: ${formatTime(ns / times)}, x${times}`);
  } else if (!!year && !day) {
    const files = getDayFiles(year);

    const { ns } = await timeIt(async () => {
      for (const f of files) {
        const day = parseInt(f.match(/\d{2}/)![0]);
        await runDay(day, year, times);
      }
    });

    console.log(`\nTotal time: ${formatTime(ns / times)}, x${times}`);
  } else if (!!year && !!day) {
    await runDay(day, year, times);
  } else {
    printUsage();
    return;
  }
}

main(...args);
