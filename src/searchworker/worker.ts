/* ./worker/worker.ts */

import { performComponentQuery as x, filterUsingIDCs as y } from "../searchalgo";
export const performComponentQuery = x;
export const filterUsingIDCs = y;

export function processData(data: string): string {
  // Process the data without stalling the UI

  return data;
}

// export function performComponentQuery(
//   forwardMap: ForwardMap,
//   reverseMapCharFreqsOnly: ReverseMapCharOnly,
//   components: string,
//   // idcs: string,
//   atLeastComponentFreq: boolean
// ) {
//   const g = new Set<string>(["a", "z"]);
//   return g;
// }
