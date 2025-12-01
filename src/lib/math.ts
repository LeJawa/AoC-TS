// Based on documentation of python's itertools.permutations
export function permutations<T>(
  iterable: Iterable<T> | ArrayLike<T>,
  r: number = undefined!
): T[][] {
  const permutations: T[][] = [];

  const pool = Array.from(iterable);
  const n = pool.length;
  r ??= n;
  if (r > n) return undefined!;

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
