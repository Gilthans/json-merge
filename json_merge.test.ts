import {json_merge} from "./json_merge"

test('Empty jsons should have no conflict', () => {
  const merge_result = json_merge({}, {}, {});
  expect(merge_result.conflicts.length).toBe(0);
});

test('Base and theirs same should always output yours', () => {
  const samples = [[]]
  for(const sample of samples){
    const base = sample[0]
    const test = sample[1]
    const merge_result = json_merge(base, base, test);
    expect(merge_result.conflicts.length).toBe(0);
    }
});



