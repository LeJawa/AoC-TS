import { readInput, timeIt } from "../common";
import { type Solution } from "../types";

const year = 2024;
const day = 9;
const lines = readInput(day, year);

type DayInputType = string;

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines[0];
}

function part1(diskmap: DayInputType): Solution {
  let forwardIndex = 0;
  let backwardIndex = diskmap.length - 1;

  let spaceToAllocate = parseInt(diskmap[backwardIndex]);

  // let fileIndex = 0

  let checksum = 0;
  let memoryIndex = 0;

  const fileIndex = (index: number) => Math.trunc(index / 2);

  while (forwardIndex < backwardIndex) {
    // Do file
    const fileSize = parseInt(diskmap[forwardIndex]);

    for (let i = 0; i < fileSize; i++, memoryIndex++) {
      checksum += memoryIndex * fileIndex(forwardIndex);
    }

    forwardIndex++;

    // Do empty space
    let emptySpace = parseInt(diskmap[forwardIndex]);

    while (emptySpace > 0) {
      if (spaceToAllocate > 0) {
        spaceToAllocate--;
      } else {
        backwardIndex -= 2;
        spaceToAllocate = parseInt(diskmap[backwardIndex]) - 1;
      }

      checksum += memoryIndex * fileIndex(backwardIndex);
      memoryIndex++;
      emptySpace--;
    }

    forwardIndex++;
  }

  if (forwardIndex === backwardIndex) {
    while (spaceToAllocate > 0) {
      checksum += memoryIndex * fileIndex(backwardIndex);
      memoryIndex++;
      spaceToAllocate--;
    }
  }

  return checksum;
}

function part2(diskmap: DayInputType): Solution {
  const availableSpaces: number[][] = [];
  const filesToMove: number[][] = [];

  let runningIndex = 0;
  Array.from(diskmap)
    .map((x) => parseInt(x))
    .forEach((size, i) => {
      if (i % 2 === 0) {
        filesToMove.push([i / 2, runningIndex, size]);
      } else {
        availableSpaces.push([runningIndex, size]);
      }
      runningIndex += size;
    });

  filesToMove.reverse();

  let checksum = 0;

  filesToMove.forEach(([fileIndex, startFileIndex, size]) => {
    if (startFileIndex < availableSpaces[0][0]) {
      return;
    }

    if (
      !availableSpaces.some(([startEmptyIndex, emptySize], i, arr) => {
        if (startEmptyIndex > startFileIndex) {
          return false;
        }

        if (size <= emptySize) {
          let spaceToAllocate = size;
          let memoryIndex = startEmptyIndex;
          while (spaceToAllocate > 0) {
            checksum += memoryIndex * fileIndex;
            memoryIndex++;
            spaceToAllocate--;
          }
          // Remove entry if emptySize - size == 0
          arr[i] = [startEmptyIndex + size, emptySize - size];
          return true;
        }
        return false;
      })
    ) {
      let spaceToAllocate = size;
      let memoryIndex = startFileIndex;
      while (spaceToAllocate > 0) {
        checksum += memoryIndex * fileIndex;
        memoryIndex++;
        spaceToAllocate--;
      }
    }
  });

  return checksum;
}

export async function main() {
  console.log(`Day ${day}:`);

  const { result: dayInput, time: time0 } = await timeIt(() => setup(lines));
  console.log(` > Setup (${time0})`);

  const { result: answer1, time: time1 } = await timeIt(() => part1(dayInput));
  console.log(` > Part 1:`, answer1, `(${time1})`);

  const { result: answer2, time: time2 } = await timeIt(() => part2(dayInput));
  console.log(` > Part 2:`, answer2, `(${time2})`);
}

export { setup, part1, part2 };
