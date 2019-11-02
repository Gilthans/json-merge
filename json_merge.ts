
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
    const base_keys = new Set(Object.keys(base));
    const their_keys = new Set(Object.keys(theirs));
    const your_keys = new Set(Object.keys(yours));

    const their_added_keys = [...their_keys].filter(key => !base_keys.has(key));
    const your_added_keys = [...your_keys].filter(key => !base_keys.has(key));

    const their_changed_keys = [...their_keys].filter(key => base_keys.has(key) && base[key] != theirs[key]);
    const your_changed_keys = [...your_keys].filter(key => base_keys.has(key) && base[key] != yours[key]);

    let merge_results = {};
    base_keys.forEach(key => {
        merge_results[key] = yours[key];
    });
    their_added_keys.forEach(key => {
        merge_results[key] = theirs[key];
    });
    your_added_keys.forEach(key => {
        merge_results[key] = yours[key];
    });

    return new MergeResults(merge_results, []);
}
