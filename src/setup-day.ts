import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import dotenv from "dotenv";
import open from "open";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const year = new Date().getFullYear();

const [, , dayArg, yearArg, openFlag] = process.argv;
const isAll = dayArg === "--all";
const y =
  yearArg && !yearArg.startsWith("--") && !isAll ? parseInt(yearArg, 10) : year;
const shouldOpen = openFlag === "--open" || yearArg === "--open";
const templatePath = path.join(__dirname, "template", "day.ts");

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
    __dirname,
    year.toString(),
    `day${day.toString().padStart(2, "0")}.ts`
  );
}

if (!dayArg) {
  console.error("Usage: ts-node src/setup-day.ts <day>|--all [year] [--open]");
  process.exit(0);
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
  if (!res.ok) {
    if (!fs.existsSync(dest)) {
      fs.writeFileSync(dest, "");
      console.log(`Writing empty input file for day ${day} (${y})`);
    }
    throw new Error(`Failed to fetch input: ${res.status}`);
  }
  const text = await res.text();
  fs.writeFileSync(dest, text);
}

async function setupDay(day: number, y: number, shouldOpen: boolean) {
  const inputPath = getInputPath(day, y);
  const dayFile = getDayFile(day, y);
  // Download input (always re-download)
  try {
    await downloadInput(day, y, inputPath);
    console.log(`Downloaded input for day ${day} (${y})`);
  } catch (e) {
    console.error(`Failed to download input for day ${day}:`, e);
  }
  // Create solution file if not exists
  if (!fs.existsSync(dayFile)) {
    let template = fs.readFileSync(templatePath, "utf-8");
    template = template
      .replace("const day = 1;", `const day = ${day};`)
      .replace("const year = new Date().getFullYear();", `const year = ${y};`);
    fs.writeFileSync(dayFile, template);
    console.log(`Created ${dayFile}`);
  } else {
    console.log(`${dayFile} already exists, not overwritten.`);
  }
  // Optionally open problem in browser
  if (shouldOpen) {
    const url = `https://adventofcode.com/${y}/day/${day}`;
    await open(url, { wait: true });
    console.log(`Opened ${url}`);
  }
}

(async () => {
  if (isAll) {
    for (let d = 1; d <= 25; d++) {
      await setupDay(d, y, false);
    }
    console.log("Setup complete for all days.");
  } else {
    const day = parseInt(dayArg, 10);
    await setupDay(day, y, shouldOpen);
  }
})();
