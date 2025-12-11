// Based on documentation of python's itertools.permutations
export function permutations<T>(
  iterable: Iterable<T> | ArrayLike<T>,
  r: number = undefined!
): T[][] {
  const permutations: T[][] = [];

  const pool = Array.from(iterable);
  const n = pool.length;
  r ??= n;
  if (r > n || r < 0) return undefined!;

  let indices = pool.map((_, i) => i);
  const cycles: number[] = [];
  for (let i = n; i > n - r; i--) cycles.push(i);

  permutations.push(indices.slice(0, r).map((i) => pool[i]));

  let continueLoop = true;
  while (continueLoop) {
    continueLoop = false;
    for (let i = r - 1; i >= 0; i--) {
      cycles[i] -= 1;
      if (cycles[i] === 0) {
        indices = indices
          .slice(0, i)
          .concat(indices.slice(i + 1))
          .concat(indices.slice(i, i + 1));
        cycles[i] = n - i;
      } else {
        const j = cycles[i];
        const temp = indices[i];
        indices[i] = indices[indices.length - j];
        indices[indices.length - j] = temp;

        permutations.push(indices.slice(0, r).map((i) => pool[i]));
        continueLoop = true;
        break;
      }
    }
  }

  return permutations;
}

export function combinations<T>(iterable: Iterable<T>, r: number): T[][] {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const combinations: T[][] = [];

  const pool = [...iterable];
  const n = pool.length;
  if (r > n) {
    return undefined!;
  }
  const indices = new Uint32Array(r).map((_, index) => index);
  combinations.push(pool.slice(0, r));
  while (true) {
    let i: number;
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] !== i + n - r) {
          break loop;
        }
      }
      return combinations;
    }
    const result: T[] = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }
    let index = (indices[i] += 1);
    result[i] = pool[index];
    for (let j = i + 1; j < r; j++) {
      indices[j] = index += 1;
      result[j] = pool[index];
    }
    combinations.push(result);
  }
}

export function permutationsWithReplacement<T>(
  iterable: Iterable<T>,
  r: number
): T[][] {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }

  const permutations: T[][] = [];

  const pool = [...iterable];
  const n = pool.length;
  if (r === 0) {
    return [];
  }
  if (n === 0 && r > 0) return undefined!;
  const indices = new Uint32Array(r);

  permutations.push(Array(r).fill(pool[0]));
  while (true) {
    let i: number;
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] === n - 1) continue;
        const result: T[] = Array(r);
        for (let j = 0; j < i; j++) result[j] = pool[indices[j]];
        const index = (indices[i] += 1);
        result[i] = pool[index];
        for (let j = i + 1; j < r; j++) {
          indices[j] = 0;
          result[j] = pool[0];
        }
        permutations.push(result);
        break loop;
      }
      return permutations;
    }
  }
}

// https://github.com/N8Brooks/combinatorics/blob/main/combinations_with_replacement.ts
export function* combinationsWithReplacement<T>(
  iterable: Iterable<T>,
  r: number
): Generator<T[]> {
  if (!Number.isInteger(r) || r < 0) {
    throw RangeError("r must be a non-negative integer");
  }
  const pool = [...iterable];
  const n = pool.length;
  if (n === 0 && r > 0) {
    return;
  }
  const indices = new Uint32Array(r);
  yield Array(r).fill(pool[0]);
  while (true) {
    let i: number;
    loop: {
      for (i = r - 1; i >= 0; i--) {
        if (indices[i] !== n - 1) {
          break loop;
        }
      }
      return;
    }
    const result: T[] = Array(r);
    for (let j = 0; j < i; j++) {
      result[j] = pool[indices[j]];
    }
    const index = indices[i] + 1;
    const element = pool[index];
    for (let j = i; j < r; j++) {
      indices[j] = index;
      result[j] = element;
    }
    yield result;
  }
}

export function max(...numbers: number[]): number {
  if (numbers.length === 0) return undefined!;
  let max = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) max = numbers[i];
  }

  return max;
}

export function min(...numbers: number[]): number {
  if (numbers.length === 0) return undefined!;
  let min = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < min) min = numbers[i];
  }

  return min;
}
