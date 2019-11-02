import {json_merge, Conflict} from "./json_merge"

test('Empty jsons should have no conflict', () => {
  const merge_result = json_merge({}, {}, {});
  expect(merge_result.conflicts.length).toBe(0);
});

test('Base and theirs same should always output yours', () => {
  const samples = [
      [{}, {}],
      [{a: 'hi'}, {a: 'bye'}],
      [{a: 'hi'}, {a: 'hi', b: 'bye'}],
      [{a: 'hi'}, {b: 'bye'}],
  ];
  for(const sample of samples){
    const base = sample[0];
    const test = sample[1];
    const merge_result = json_merge(base, base, test);
    expect(merge_result.conflicts.length).toEqual(0);
    expect(merge_result.merged).toEqual(test);
    }
});

test('Base and yours same should always output theirs', () => {
  const samples = [
      [{}, {}],
      [{a: 'hi'}, {a: 'bye'}],
      [{a: 'hi'}, {a: 'hi', b: 'bye'}],
      [{a: 'hi'}, {b: 'bye'}],
  ];
  for(const sample of samples){
    const base = sample[0];
    const test = sample[1];
    const merge_result = json_merge(base, test, base);
    expect(merge_result.merged).toEqual(test);
    expect(merge_result.conflicts.length).toEqual(0);
  }
});

test('Yours and theirs same should never have conflict', () => {
  const samples = [
      [{}, {}],
      [{a: 'hi'}, {a: 'bye'}],
      [{a: 'hi'}, {a: 'hi', b: 'bye'}],
      [{a: 'hi'}, {b: 'bye'}],
  ];
  for(const sample of samples){
    const base = sample[0];
    const test = sample[1];
    const merge_result = json_merge(base, test, test);
    expect(merge_result.merged).toEqual(test);
    expect(merge_result.conflicts.length).toEqual(0);
  }
});

test('Different added fields should cause no conflict', () => {
    const merge_result = json_merge({a: 'hi'}, {a: 'hi', b: 'bye'}, {a: 'hi', c: 'goodbye'});
    expect(merge_result.conflicts.length).toEqual(0);
    expect(merge_result.merged).toEqual({a: 'hi', b: 'bye', c: 'goodbye'});
});

test('Different changed fields should cause no conflict', () => {
    const merge_result = json_merge({a: 'hi1', b: 'hi2'}, {a: 'bye1', b: 'hi2'}, {a: 'hi1', b: 'bye2'});
    expect(merge_result.conflicts.length).toEqual(0);
    expect(merge_result.merged).toEqual({a: 'bye1', b: 'bye2'});
});

test('Different removed fields should cause no conflict', () => {
    const merge_result = json_merge({a: 'hi1', b: 'hi2', c: 'hi3'}, {a: 'hi1', b: 'hi2'}, {a: 'hi1', c: 'hi3'});
    expect(merge_result.conflicts.length).toEqual(0);
    expect(merge_result.merged).toEqual({a: 'hi1'});
});

test('Same field changed should cause conflict', () => {
    const merge_result = json_merge({a: 'base'}, {a: 'theirs'}, {a: 'yours'});
    expect(merge_result.conflicts.length).toEqual(1);
    expect(merge_result.conflicts[0]).toEqual(new Conflict('concurrent_change', 'a', 'base', 'theirs', 'yours'));
    expect(merge_result.merged).toEqual({a: merge_result.conflicts[0]});
});

test('Same field added with different value should cause conflict', () => {
    const merge_result = json_merge({a: 'hi'}, {a: 'hi', b: 'theirs'}, {a: 'hi', b: 'yours'});
    expect(merge_result.conflicts.length).toEqual(1);
    expect(merge_result.conflicts[0]).toEqual(new Conflict('concurrent_addition', 'b', null, 'theirs', 'yours'));
    expect(merge_result.merged).toEqual({a: 'hi', b: merge_result.conflicts[0]});
});
