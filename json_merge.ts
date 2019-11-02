
export class MergeResults {
  conflicts: string[];
  merged: object;
  /**
   *
   */
  constructor(merged: object, conflicts: string[]) {
    this.conflicts = conflicts;
    this.merged = merged;
  }
}

// TODO: support non-objects (arrays, strings, etc)
export function json_merge(base: object, theirs: object, yours: object): MergeResults {
  return new MergeResults(yours, []);
}
