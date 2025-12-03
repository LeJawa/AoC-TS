export class TupleSet {
  data = new Map<number, Set<number>>();

  add([first, second]: number[]): TupleSet {
    if (!this.data.has(first)) {
      this.data.set(first, new Set());
    }

    this.data.get(first)?.add(second);
    return this;
  }

  has([first, second]: number[]) {
    return this.data.has(first) && this.data.get(first)?.has(second);
  }

  delete([first, second]: number[]) {
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
