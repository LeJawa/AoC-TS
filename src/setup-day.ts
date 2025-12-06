import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { sleep } from "./common";
import { aocFetch } from "./common";
dotenv.config();

const [, , ...args] = process.argv;
const templatePath = path.join(__dirname, "..", "src", "template", "day.ts");

function getInputPath(day: number, year: number) {
  return path.join(
    __dirname,
    "..",
    "inputs",
    year.toString(),
    `day${day.toString().padStart(2, "0")}.txt`
  );
}
function getDayFile(day: number, year: number) {
  return path.join(
    __dirname, // __dirname is ./dist directory
    "..",
    "src",
    year.toString(),
    `day${day.toString().padStart(2, "0")}.ts`
  );
}

export async function downloadInput(
  day: number,
  year: number,
  dest: string
): Promise<void> {
  const session = process.env.AOC_SESSION;
  if (!session) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, "");
      console.log(`Writing empty input file for day ${day} (${year})`);
    }
    throw new Error("AOC_SESSION not set in .env");
  }
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  const res = await aocFetch(url, {
    headers: { Cookie: `session=${session}` },
  });
  if (!res.ok) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, "");
      console.log(`Writing empty input file for day ${day} (${year})`);
    }
    throw new Error(`Failed to fetch input: ${res.status}`);
  }
  const text = await res.text();
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text);
}

async function setupDay(day: number, year: number, shouldOpen: boolean) {
  const inputPath = getInputPath(day, year);
  const dayFile = getDayFile(day, year);
  // Download input if it doesn't exist
  if (!fs.existsSync(inputPath)) {
    try {
      await downloadInput(day, year, inputPath);
      console.log(`Downloaded input for day ${day} (${year})`);
    } catch (e) {
      console.error(
        `Failed to download input for day ${day}:`,
        (e as Error).message
      );
    }
  } else {
    console.log(
      `${path.relative(".", inputPath)} already exists, not overwritten.`
    );
  }
  // Create solution file if not exists
  if (!fs.existsSync(dayFile)) {
    let template = fs.readFileSync(templatePath, "utf-8");
    template = template
      .replace("const day = 1;", `const day = ${day};`)
      .replace(
        "const year = new Date().getFullYear();",
        `const year = ${year};`
      );
    fs.mkdirSync(path.dirname(dayFile), { recursive: true });
    fs.writeFileSync(dayFile, template);
    console.log(`Created ${dayFile}`);
  } else {
    console.log(
      `${path.relative(".", dayFile)} already exists, not overwritten.`
    );
  }
  // Optionally open problem in browser
  if (shouldOpen) {
    const { default: open } = await import("open");
    const url = `https://adventofcode.com/${year}/day/${day}`;
    await open(url, { wait: true });
    console.log(`Opened ${url}`);
  }
}

const printUsage = () => {
  console.log("Usage: pnpm run setup-day <year> <day> [--open]");
  console.log("       pnpm run setup-day <year> --all");
};

async function main(...args: string[]) {
  if (args.length > 3) {
    printUsage();
    return;
  }

  const year = /^\d{4}$/.test(args[0])
    ? parseInt(args[0])
    : /^\d{4}$/.test(args[1])
    ? parseInt(args[1])
    : undefined;

  const day = /^\d{1,2}$/.test(args[1])
    ? parseInt(args[1])
    : /^\d{1,2}$/.test(args[0])
    ? parseInt(args[0])
    : undefined;

  const isAll = !!year && args[1] === "--all" && args[2] === undefined;

  const openPage = !!year && !!day && args[2] == "--open";

  if (isAll) {
    for (let d = 1; d <= 25; d++) {
      await setupDay(d, year, false);
    }
    console.log("Setup complete for all days.");
  } else if (!!year && !!day) {
    await setupDay(day, year, openPage);
  } else {
    printUsage();
    return;
  }
}

main(...args);
