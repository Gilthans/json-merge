
export class Conflict {
    type: string;
    path: string;
    base_value: object;
    their_value: object;
    your_value: object;

    constructor(type: string, path: string, base_value: any, their_value: any, your_value: any) {
        this.type = type;
        this.path = path;
        this.base_value = base_value;
        this.their_value = their_value;
        this.your_value = your_value;
    }
}

export class MergeResults {
  conflicts: Conflict[];
  merged: object;
  /**
   *
   */
  constructor(merged: object, conflicts: Conflict[]) {
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

    const merge_result = {};
    const conflicts = [];
    base_keys.forEach(key => {
        if (your_removed_keys.has(key)){
            if (their_changed_keys.has(key)){
                const conflict = new Conflict('change_removed', key, base[key], theirs[key], null);
                conflicts.push(conflict);
                merge_result[key] = conflict;
            }
            return;
        }
        if (their_removed_keys.has(key)){
            if (your_changed_keys.has(key)){
                const conflict = new Conflict('change_removed', key, base[key], null, yours[key]);
                conflicts.push(conflict);
                merge_result[key] = conflict;
            }
            return;
        }

        if (your_changed_keys.has(key) && their_changed_keys.has(key) && yours[key] != theirs[key]){
            const conflict = new Conflict('concurrent_change', key, base[key], theirs[key], yours[key]);
            conflicts.push(conflict);
            merge_result[key] = conflict;
        }
        else if (your_changed_keys.has(key))
            merge_result[key] = yours[key];
        else if (their_changed_keys.has(key))
            merge_result[key] = theirs[key];
        else
            // Can this happen?
            merge_result[key] = base[key];
    });
    their_added_keys.forEach(key => {
        if (your_added_keys.has(key) && yours[key] != theirs[key]){
            const conflict = new Conflict('concurrent_addition', key, null, theirs[key], yours[key]);
            conflicts.push(conflict);
            merge_result[key] = conflict;
            return;
        }
        merge_result[key] = theirs[key];
    });
    your_added_keys.forEach(key => {
        if (their_added_keys.has(key))
            return;
        merge_result[key] = yours[key];
    });

    return new MergeResults(merge_result, conflicts);
}
