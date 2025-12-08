import { readInput, timeIt } from "../common";
import { TupleSet2D } from "../lib/collections";
import { type Solution } from "../types";

const year = 2024;
const day = 12;
const lines = readInput(day, year);

type DayInputType = string[];

// Returns the manipulated input lines
function setup(lines: string[]): DayInputType {
  return lines;
}

const calculateSides = (outside: Set<string>) => {
  let sides = 0;
  const sideSet = new Set();

  const mappedOutside = Array.from(outside).map((v) => {
    const [x, y, dir] = v.split(",");
    return [parseInt(x), parseInt(y), dir];
  });

  mappedOutside.forEach(([x, y, dir]) => {
    if (sideSet.has(`${x},${y},${dir}`)) {
      return;
    }
    sideSet.add(`${x},${y},${dir}`);
    sides += 1;

    if (dir === "left" || dir === "right") {
      // go down
      let delta = 1;
      while (true) {
        if (outside.has(`${x},${(y as number) + delta},${dir}`)) {
          sideSet.add(`${x},${(y as number) + delta},${dir}`);
          delta += 1;
        } else {
          break;
        }
      }
      // go up
      delta = -1;
      while (true) {
        if (outside.has(`${x},${(y as number) + delta},${dir}`)) {
          sideSet.add(`${x},${(y as number) + delta},${dir}`);
          delta += -1;
        } else {
          break;
        }
      }
    } else if (dir === "up" || dir === "down") {
      // go right
      let delta = 1;
      while (true) {
        if (outside.has(`${(x as number) + delta},${y},${dir}`)) {
          sideSet.add(`${(x as number) + delta},${y},${dir}`);
          delta += 1;
        } else {
          break;
        }
      }
      // go left
      delta = -1;
      while (true) {
        if (outside.has(`${(x as number) + delta},${y},${dir}`)) {
          sideSet.add(`${(x as number) + delta},${y},${dir}`);
          delta += -1;
        } else {
          break;
        }
      }
    }
  });

  return sides;
};

const getAreaPerimeter = (
  x0: number,
  y0: number,
  map: string[],
  size: number,
  visited: TupleSet2D
) => {
  const queue: [number, number][] = [[x0, y0]];
  const outside = new Set<string>();
  let area = 0;

  while (queue.length > 0) {
    const cell: [number, number] = queue.pop()!;

    if (visited.has(cell)) continue;

    visited.add(cell);
    area += 1;

    const [x, y] = cell;

    if (x > 0) {
      if (map[y][x - 1] === map[y][x]) {
        queue.push([x - 1, y]);
      } else {
        outside.add(`${x - 1},${y},right`);
      }
    } else {
      outside.add(`${x - 1},${y},right`);
    }
    if (x < size - 1) {
      if (map[y][x + 1] === map[y][x]) {
        queue.push([x + 1, y]);
      } else {
        outside.add(`${x + 1},${y},left`);
      }
    } else {
      outside.add(`${x + 1},${y},left`);
    }
    if (y > 0) {
      if (map[y - 1][x] === map[y][x]) {
        queue.push([x, y - 1]);
      } else {
        outside.add(`${x},${y - 1},up`);
      }
    } else {
      outside.add(`${x},${y - 1},up`);
    }
    if (y < size - 1) {
      if (map[y + 1][x] === map[y][x]) {
        queue.push([x, y + 1]);
      } else {
        outside.add(`${x},${y + 1},down`);
      }
    } else {
      outside.add(`${x},${y + 1},down`);
    }
  }
  const perimeter = outside.size;
  const sides = calculateSides(outside);

  return [area, perimeter, sides];
};

function part1(map: DayInputType): Solution {
  const size = map.length;
  const visited = new TupleSet2D();
  let price = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((_, x) => {
      if (visited.has([x, y])) return;

      const [area, perimeter, _sides] = getAreaPerimeter(
        x,
        y,
        map,
        size,
        visited
      );
      price += area * perimeter;
    });
  });
  return price;
}

function part2(map: DayInputType): Solution {
  const size = map.length;
  const visited = new TupleSet2D();
  let price = 0;

  map.forEach((row, y) => {
    Array.from(row).forEach((_, x) => {
      if (visited.has([x, y])) return;

      const [area, _perimeter, sides] = getAreaPerimeter(
        x,
        y,
        map,
        size,
        visited
      );
      price += area * sides;
    });
  });
  return price;
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
