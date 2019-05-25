
export class MergeResults {
  conflicts: string[];
  merged: object;
  /**
   *
   */
  constructor() {
    this.conflicts = []
    this.merged = {}
  }
}

// TODO: support non-objects (arrays, strings, etc)
export function json_merge(base: object, theirs: object, yours: object): MergeResults {
  return new MergeResults()
}
