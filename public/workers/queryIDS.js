importScripts("../Queue.js");

// e.g 車車 should return 䡛, 亻丁 should return 停 because ⿰亻亭 and 亭 is ⿱⿳亠口冖丁

/* entering two instances of 木 should return
 a narrowed down search containing 𣖧	⿰木柴 because 木 is a component of 柴 also
 idcs in the form of
 /⿰.*⿴/g should match ⿰魚⿱彑⿴北矢
*/
const performQuery = (
  forwardMap,
  reverseMap,
  radicals,
  idcs,
  exactRadicalFreq
) => {
  const radicalFrequencies = {};
  for (let radical of radicals) {
    if (!radicalFrequencies[radical]) {
      radicalFrequencies[radical] = 0;
    }
    radicalFrequencies[radical] += 1;
  }

  console.log(radicalFrequencies);

  let t0 = performance.now();
  const charToSet = {};

  for (let char of Object.keys(radicalFrequencies)) {
    const q = new Queue();
    charToSet[char] = new Set();
    q.enqueue(char);
    while (!q.isEmpty()) {
      const frontier = [];
      while (!q.isEmpty()) {
        const c = q.dequeue();
        frontier.push(c);
        charToSet[char].add(c);
      }
      // queue is now empty
      for (let _char of frontier) {
        let chars = [];
        const res = forwardMap[_char];
        if (res) chars = res;
        for (let c of chars) {
          q.enqueue(c);
        }
      }
    }
    // do BFS
    charToSet[char].delete(char);
  }
  const sets = Object.values(charToSet);
  let temp = new Set();
  if (sets.length) {
    temp = sets[0];
    for (let i = 1; i < sets.length; i++) {
      temp = new Set(Array.from(temp).filter((x) => sets[i].has(x)));
    }
  }

  let t1 = performance.now();
  console.log(`BFS took ${t1 - t0} milliseconds.`);

  if (!exactRadicalFreq) return { charToSet, res: temp };

  // match occurrences
  const res = new Set();
  for (let char of temp) {
    let valid = true;
    for (let radical of Object.keys(radicalFrequencies)) {
      if (radicalFrequencies[radical] === 1) continue;
      const g = reverseMap[char].charFreqs
        .map((charFreq) => charFreq[radical])
        .filter(Number.isInteger);
      const maxOccurrences = Math.max(g) || g[0];
      /* if (char === "𥄳") {
        console.log(reverseMap[char].charFreqs);
        console.log(g);
        console.log(maxOccurrences);
        console.log(radicalFrequencies);
      } */
      if (maxOccurrences < radicalFrequencies[radical]) {
        valid = false;
        break;
      }
    }
    if (valid) res.add(char);
  }

  return { charToSet, res };
};

self.onmessage = ($event) => {
  if ($event && $event.data && $event.data.msg === "query") {
    // console.log($event.data);
    const {
      forwardMap,
      reverseMap,
      radicals,
      idcs,
      exactRadicalFreq,
    } = $event.data;
    // const {
    //   forwardMapUint8,
    //   reverseMapUint8,
    //   radicals,
    //   idcs,
    //   exactRadicalFreq,
    // } = $event.data;

    const t0 = performance.now();

    /* let decoder = new TextDecoder("utf-8");
    let view = new DataView(forwardMapUint8, 0, forwardMapUint8.byteLength);
    let string = decoder.decode(view);
    let forwardMap = JSON.parse(string);

    view = new DataView(reverseMapUint8, 0, reverseMapUint8.byteLength);
    string = decoder.decode(view);
    let reverseMap = JSON.parse(string); */

    const t2 = performance.now();
    const result = performQuery(
      forwardMap,
      reverseMap,
      radicals,
      idcs,
      exactRadicalFreq
      // forwardMapUint8,
      // reverseMapUint8
    );
    const t3 = performance.now();
    console.log(`Actual query time took ${t3 - t2} milliseconds.`);
    const t1 = performance.now();
    console.log(`Total query time took ${t1 - t0} milliseconds.`);
    self.postMessage(
      {
        msg: "done",
        ...result,
        // forwardMapUint8,
        // reverseMapUint8,
        // must send this back
      }
      // [forwardMapUint8, reverseMapUint8]
    );
  }
};
