const IDCSet = new Set([
  "⿰",
  "⿱",
  "⿲",
  "⿳",
  "⿴",
  "⿵",
  "⿶",
  "⿷",
  "⿸",
  "⿹",
  "⿺",
  "⿻",
]);

// operates on itself
// reverseMap[char] = { utf_code: entry[0], ids_strings: reverseMapValue };
const finalizeReverseMap = (reverseMap) => {
  const mergeTwoFreqs = (freqsA, freqsB) => {
    const res = { ...freqsB };
    for (let char of Object.keys(freqsA)) {
      if (!res[char]) res[char] = 0;
      res[char] += freqsA[char];
    }
    return res;
  };

  const freqPerm = (freqsArr) => {
    // freqsArr is [ [ {char: 99}, {char2, 99}, ...] ]

    const lengths = freqsArr.map((arr) => arr.length);

    let res = [];
    /*
    [
      [ 0, 0, 0 ], [ 0, 0, 1 ],
      [ 0, 0, 2 ], [ 0, 1, 0 ],
      [ 0, 1, 1 ], [ 0, 1, 2 ],
      [ 1, 0, 0 ], [ 1, 0, 1 ],
      [ 1, 0, 2 ], [ 1, 1, 0 ],
      [ 1, 1, 1 ], [ 1, 1, 2 ]
    ]*/
    let tmp = [];

    const rec = (idx) => {
      if (idx === lengths.length) {
        res.push([...tmp]);
      } else {
        for (let i = 0; i < lengths[idx]; i++) {
          tmp.push(i);
          rec(idx + 1);
          tmp.pop();
        }
      }
    };
    rec(0);

    const ans = [];
    for (let permIdArr of res) {
      let res = {};
      const perm = permIdArr.map((elem, i) => freqsArr[i][elem]);
      for (let item of perm) {
        res = mergeTwoFreqs(res, item);
      }
      ans.push(res);
    }
    return ans;
  };

  const rec = (char) => {
    // ids_strings is... reverseMapValue.push({ ids: str, locales });
    // do DFS...

    const freqsAtThisNode = [];
    const { ids_strings } = reverseMap[char];

    for (let i = 0; i < ids_strings.length; i++) {
      freqsAtThisNode.push({});
      const { ids } = ids_strings[i];
      for (let idsChar of ids) {
        if (!IDCSet.has(idsChar) && idsChar !== char) {
          if (!freqsAtThisNode[i][idsChar]) freqsAtThisNode[i][idsChar] = 0;
          freqsAtThisNode[i][idsChar] += 1;
        }
      }
    }

    let res = [];
    for (let i = 0; i < freqsAtThisNode.length; i++) {
      let freqs = freqPerm(
        Object.keys(freqsAtThisNode[i]).map((key) => rec(key))
      );
      freqs = freqs.map((freq) => mergeTwoFreqs(freq, freqsAtThisNode[i]));
      res = res.concat(freqs);
    }

    return res;
  };

  for (let char of Object.keys(reverseMap)) {
    reverseMap[char].charFreqs = rec(char);
  }

  return reverseMap;
};

const processIDSText = (text) => {
  const forwardMap = {};
  let reverseMap = {}; // char:  { utf_code: U+0000, ids_strings: [{ids: decomp1, locales: 'GT'}, {ids: decomp2, locales: 'JK'}] }
  const baseRadicals = new Set();
  const metadata = {
    entries: 0,
    unique_radicals: 0,
    date: new Date(),
  };
  const split = text.split("\n");
  // console.log(split);
  /* "U+4EB4\t亴\t⿳⿳亠口冖土九[GK]\t⿳⿳亠口冖⿻二丨九[T]".split('\t')
    Array(4) [ "U+4EB4", "亴", "⿳⿳亠口冖土九[GK]", "⿳⿳亠口冖⿻二丨九[T]" ] */
  //   let entries = 0;
  for (let _entry of split) {
    if (_entry.trim().startsWith("#")) continue;
    // entries += 1;
    metadata.entries += 1;
    const entry = _entry.split("\t");
    const utfCp = entry[0];
    const char = entry[1];

    const reverseMapValue = [];
    for (let i = 2; i < entry.length; i++) {
      const localeStart = entry[i].indexOf("[");
      const str = localeStart > -1 ? entry[i].substr(0, localeStart) : entry[i];
      const locales = localeStart > -1 ? entry[i].substr(localeStart) : null;
      reverseMapValue.push({ ids: str, locales });

      for (let radical of str) {
        if (IDCSet.has(radical)) continue;
        if (radical === char) {
          /* e.g. U+27C28	𧰨	𧰨, there exists an entry where this radical
            can only be described by itself */
          if (entry.length === 3) {
            baseRadicals.add(radical);
            metadata.unique_radicals += 1;
          }
          continue;
        }

        if (!(radical in forwardMap)) {
          forwardMap[radical] = new Set();
        }
        forwardMap[radical].add(char);
      }
    }
    reverseMap[char] = { utf_code: entry[0], ids_strings: reverseMapValue };
  }

  // need to convert to an array because we can't stringify Sets apparently...
  for (let radical of Object.keys(forwardMap))
    forwardMap[radical] = Array.from(forwardMap[radical]);
  reverseMap = finalizeReverseMap(reverseMap);
  return { baseRadicals, forwardMap, reverseMap, metadata };
};

const processIDSData = async (eventdata) => {
  const { ids_url } = eventdata;
  const resp = await fetch(ids_url);
  const text = await resp.text();
  const { baseRadicals, forwardMap, reverseMap, metadata } = processIDSText(
    text
  );
  metadata.date = resp.headers.get("Last-modified");
  return { baseRadicals, forwardMap, reverseMap, metadata };
};

const processStrokeCountText = (text) => {
  const strokeCount = {};
  const split = text.split("\n");

  for (let _entry of split) {
    if (_entry.trim().startsWith("#")) continue;
    const entry = _entry.split("\t");
    const [code, field] = [entry[0], entry[1]];

    if (field === "kTotalStrokes") {
      strokeCount[
        String.fromCodePoint(parseInt(code.substring(2), 16))
      ] = parseInt(entry[2]);
    }
  }
  return { strokeCount };
};

const processStrokeCountData = async (eventdata) => {
  const { unicode_irg_url } = eventdata;
  const resp = await fetch(unicode_irg_url);
  const text = await resp.text();
  const { strokeCount } = processStrokeCountText(text);
  return { strokeCount };
};

/* a collection of basic 0-stroke radicals and
their known variants (any type), for use in the
radical searcher */
const processIRGVariantsTexts = (IRGtext, Variantsresp) => {
  const zeroVariants = {};
  {
    const split = IRGtext.split("\n");

    for (let _entry of split) {
      if (!_entry) continue;
      if (_entry.trim().startsWith("#")) continue;
      const entry = _entry.split("\t");
      const [code, field] = [entry[0], entry[1]];
      if (field !== "kRSUnicode") continue;
      const values = entry[2].split(" ");
      for (let i = 0; i < values.length; i++) {
        const value = values[i].replace("'", "");
        if (value.endsWith(".0")) {
          if (!zeroVariants[value]) zeroVariants[value] = new Set();
          zeroVariants[value].add(
            String.fromCodePoint(parseInt(code.substring(2), 16))
          );
        }
      }
    }
  }

  const mapifiedVariants = {};
  {
    const split = Variantsresp.split("\n");
    for (let _entry of split) {
      if (!_entry) continue;
      if (_entry.trim().startsWith("#")) continue;
      const entry = _entry.split("\t");
      const [code, field] = [entry[0], entry[1]];
      // if (field === "kSpoofingVariant") continue;
      const char = String.fromCodePoint(parseInt(code.substring(2), 16));
      if (!mapifiedVariants[char]) mapifiedVariants[char] = [];
      const values = entry[2].split(" ");
      for (let value of values) {
        value = value.substring(0, value.indexOf("<")) || value;
        const variant = String.fromCodePoint(parseInt(value.substring(2), 16));
        mapifiedVariants[char].push(variant);
      }
    }

    for (let set of Object.values(zeroVariants)) {
      for (let char of set) {
        // modification of set is intended
        if (!mapifiedVariants[char]) continue;
        for (let variant of mapifiedVariants[char]) {
          set.add(variant);
        }
      }
    }
  }

  const variantRadicals = {};

  for (let set of Object.values(zeroVariants)) {
    for (let char of set) {
      variantRadicals[char] = set;
    }
  }

  return { variantRadicals };
};

const processIRGVariantsData = async (eventdata) => {
  const { unicode_irg_url, unicode_variants_url } = eventdata;
  const IRGresp = await fetch(unicode_irg_url);
  const IRGtext = await IRGresp.text();

  const Variantsresp = await fetch(unicode_variants_url);
  const Variantstext = await Variantsresp.text();
  return processIRGVariantsTexts(IRGtext, Variantstext);
};

const processReadingsText = (text) => {
  const map = {};
  const split = text.split("\n");
  for (let _entry of split) {
    if (!_entry) continue;
    if (_entry.trim().startsWith("#")) continue;

    const entry = _entry.split("\t");
    const [code, field] = [entry[0], entry[1]];

    const char = String.fromCodePoint(parseInt(code.substring(2), 16));
    if (!map[char]) map[char] = {};
    map[char][field] = entry[2];
  }
  return { readings: map };
};

const processReadingsData = async (eventdata) => {
  const { unicode_readings_url } = eventdata;
  const resp = await fetch(unicode_readings_url);
  const text = await resp.text();
  return processReadingsText(text);
};

self.onmessage = async ($event) => {
  if ($event && $event.data && $event.data.msg === "load") {
    const t0 = performance.now();
    /* const { ids_url } = $event.data;
    const resp = await fetch(ids_url);
    const text = await resp.text();
    const { baseRadicals, forwardMap, reverseMap, metadata } = processIDSText(
      text
    );
    metadata.date = resp.headers.get("Last-modified"); */

    const {
      baseRadicals,
      forwardMap,
      reverseMap,
      metadata,
    } = await processIDSData($event.data);

    const { strokeCount } = await processStrokeCountData($event.data);

    const { variantRadicals } = await processIRGVariantsData($event.data);

    const { readings } = await processReadingsData($event.data);
    // https://stackoverflow.com/questions/34057127/how-to-transfer-large-objects-using-postmessage-of-webworker
    // transferring forwardMap and reverseMap over and over again to the web worker is slow

    /* const forwardMapUint8 = new TextEncoder("utf-8").encode(
      JSON.stringify(forwardMap)
    ).buffer;

    const reverseMapUint8 = new TextEncoder("utf-8").encode(
      JSON.stringify(reverseMap)
    ).buffer; */

    const t1 = performance.now();
    console.log(`Fetching and processing IDS took ${t1 - t0} milliseconds.`);
    self.postMessage(
      {
        msg: "done",
        baseRadicals: Array.from(baseRadicals),
        forwardMap,
        reverseMap,
        strokeCount,
        variantRadicals,
        readings,
        // forwardMapUint8,
        // reverseMapUint8,
        metadata,
      }
      // [forwardMapUint8, reverseMapUint8]
    );
  }
};
