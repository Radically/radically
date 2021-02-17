import { Queue } from "../utils";

export const performComponentQuery = (
  forwardMap: ForwardMap,
  reverseMapCharFreqsOnly: ReverseMapCharOnly,
  components: string,
  // idcs: string,
  atLeastComponentFreq = false
) => {
  // input radical to frequency
  const componentFrequencies = {} as { [key: string]: number };
  for (let component of components) {
    if (!componentFrequencies[component]) {
      componentFrequencies[component] = 0;
    }
    componentFrequencies[component] += 1;
  }

  /* source char to BFS visited set
  need to do BFS because forwardMap isn't recursive
  "人":["羲","个","亥","亼","亽","亾","仄","介","仌"...
  人 only includes those characters which have 人 in their immediate IDSes, hence 齒
  isn't in there */
  const charToSet = {} as { [key: string]: Set<string> };
  const t0 = performance.now();

  for (let char of Object.keys(componentFrequencies)) {
    const q = new Queue<string>();
    charToSet[char] = new Set();
    q.enqueue(char);
    // doubles as the "visited" set
    charToSet[char].add(char!);

    while (!q.isEmpty()) {
      const frontier = [] as string[];
      while (!q.isEmpty()) {
        const c = q.dequeue();
        frontier.push(c!);
      }
      // queue is now empty
      for (let _char of frontier) {
        let chars = [] as string[];
        const res = forwardMap[_char];
        if (res) chars = res;
        for (let c of chars) {
          if (!charToSet[char].has(c)) {
            q.enqueue(c);
            charToSet[char].add(c!);
          }
        }
      }
    }
    // do BFS
    charToSet[char].delete(char);
  }

  // merge all the sets together
  const sets = Object.values(charToSet);
  let temp = new Set<string>();
  if (sets.length) {
    temp = sets[0];
    for (let i = 1; i < sets.length; i++) {
      temp = new Set(Array.from(temp).filter((x) => sets[i].has(x)));
    }
  }

  const t1 = performance.now();
  console.log(`BFS took ${t1 - t0} milliseconds.`);

  if (!atLeastComponentFreq) return temp;
  // match occurrences
  const res = new Set<string>();
  for (let resultChar of Array.from(temp)) {
    let valid = true;

    const reverseMapCharFreqs = reverseMapCharFreqsOnly[resultChar] || {};

    for (let component of Object.keys(componentFrequencies)) {
      const charFreq = reverseMapCharFreqs[component] || 1;
      if (charFreq < componentFrequencies[component]) {
        valid = false;
      }
    }

    if (valid) res.add(resultChar);
  }
  return res;
};
