import fs from "node:fs";
import path from "node:path";

const addAtTheEnd = (content, toAdd) => {
  if (content.endsWith(toAdd)) return content;
  else return content + toAdd;
};

const applyChangeToContent = (originalFileContent) => {
  return addAtTheEnd(originalFileContent, "\nexport { part1, part2 };\n");
};

const srcDir = "./src";

const dayFiles = fs
  .readdirSync(srcDir) // Read the contents of the src dir
  .filter((dir) => /\d{4}/.test(dir)) // Select only dirs with year format (4 digits)
  .map((dir) => path.join(srcDir, dir)) // Prepend srcDir to dir name
  .flatMap(
    // Join the following into a single array
    (dir) =>
      fs
        .readdirSync(dir) // Read the contents of the year dir
        .filter((file) => /day\d\d\.ts/.test(file)) // Filter out non day files
        .map((file) => path.join(dir, file)) // Prepend the year dir to the day file
  );

dayFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  const newContent = applyChangeToContent(content);

  fs.writeFileSync(file, newContent);
});
