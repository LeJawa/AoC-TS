/**
 * A set collection that accepts arrays of 2 numbers
 */
export class TupleSet2D {
  data = new Map<number, Set<number>>();

  add([first, second]: [number, number]): TupleSet2D {
    if (!this.data.has(first)) {
      this.data.set(first, new Set());
    }

    this.data.get(first)?.add(second);
    return this;
  }

  has([first, second]: [number, number]) {
    return this.data.has(first) && this.data.get(first)?.has(second);
  }

  delete([first, second]: [number, number]) {
    if (!this.data.has(first) || !this.data.get(first)?.has(second))
      return false;

    this.data.get(first)?.delete(second);
    if (this.data.get(first)?.size === 0) {
      this.data.delete(first);
    }

    return true;
  }

  size() {
    let size = 0;
    this.data.forEach((set) => {
      size += set.size;
    });
    return size;
  }
}
