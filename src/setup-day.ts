import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { downloadInput } from "./common.ts";
import open from "open";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const year = new Date().getFullYear();
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
