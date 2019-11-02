import {json_merge} from "./json_merge"

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

test('Added fields should cause no conflict', () => {
    const merge_result = json_merge({a: 'hi'}, {a: 'hi', b: 'bye'}, {a: 'hi', c: 'goodbye'});
    expect(merge_result.conflicts.length).toEqual(0);
    expect(merge_result.merged).toEqual({a: 'hi', b: 'bye', c: 'goodbye'});
});

test('Different changed fields should cause no conflict', () => {
    const merge_result = json_merge({a: 'hi1', b: 'hi2'}, {a: 'bye1', b: 'hi2'}, {a: 'hi1', b: 'bye2'});
    expect(merge_result.conflicts.length).toEqual(0);
    expect(merge_result.merged).toEqual({a: 'bye1', b: 'bye2'});
});
