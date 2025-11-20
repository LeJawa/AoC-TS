import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import dotenv from "dotenv";
import open from "open";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const year = new Date().getFullYear();
const year = 2018;
const [, , dayArg, yearArg, openFlag] = process.argv;
if (!dayArg) {
  console.error("Usage: ts-node src/setup-day.ts <day> [year] [--open]");
  process.exit(1);
}
const day = parseInt(dayArg, 10);
const y = yearArg && !yearArg.startsWith("--") ? parseInt(yearArg, 10) : year;
const shouldOpen = openFlag === "--open" || yearArg === "--open";

const inputPath = path.join(
  __dirname,
  "..",
  "inputs",
  `day${day.toString().padStart(2, "0")}.txt`
);
const dayFile = path.join(
  __dirname,
  "days",
  `day${day.toString().padStart(2, "0")}.ts`
);
const templatePath = path.join(__dirname, "template", "day.ts");

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

(async () => {
  // Download input (always re-download)
  try {
    await downloadInput(day, y, inputPath);
    console.log(`Downloaded input for day ${day} (${y})`);
  } catch (e) {
    console.error("Failed to download input:", e);
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
})();
