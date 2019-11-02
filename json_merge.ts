
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

    const their_added_keys = new Set([...their_keys].filter(key => !base_keys.has(key)));
    const your_added_keys = new Set([...your_keys].filter(key => !base_keys.has(key)));

    const their_changed_keys = new Set([...their_keys].filter(key => base_keys.has(key) && base[key] != theirs[key]));
    const your_changed_keys = new Set([...your_keys].filter(key => base_keys.has(key) && base[key] != yours[key]));

    const their_removed_keys = new Set([...base_keys].filter(key => !their_keys.has(key)));
    const your_removed_keys = new Set([...base_keys].filter(key => !your_keys.has(key)));

    let merge_results = {};
    base_keys.forEach(key => {
        if (your_removed_keys.has(key)){
            if (their_changed_keys.has(key)){
                // TODO
            }
            return;
        }

        if (your_changed_keys.has(key) && their_changed_keys.has(key)){
            // TODO
        }
        else if (your_changed_keys.has(key))
            merge_results[key] = yours[key];
        else
            merge_results[key] = theirs[key];
    });
    their_added_keys.forEach(key => {
        merge_results[key] = theirs[key];
    });
    your_added_keys.forEach(key => {
        merge_results[key] = yours[key];
    });

    return new MergeResults(merge_results, []);
}
