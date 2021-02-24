import { getRawReadings } from "./unihan-fetcher";
import { writeJSON } from "./writer";

import { JSON_FILE_NAMES } from "../src/constants";
import { getPUAData } from "./babelstone-pua-fetcher";

const main = async () => {
  const RawReadingsString = (await getRawReadings()).split("\n");

  const map = {} as ReadingsMap;
  for (let _entry of RawReadingsString) {
    if (!_entry) continue;
    if (_entry.trim().startsWith("#")) continue;

    const entry = _entry.split("\t");
    const [code, field] = [entry[0], entry[1]];

    const char = String.fromCodePoint(parseInt(code.substring(2), 16));
    if (!map[char]) map[char] = {};
    map[char][field] = entry[2];
  }

  const babelstonePUAData = await getPUAData();
  for (let { char, note, src, src_refs, enc_stat } of babelstonePUAData.data) {
    map[char] = {
      note,
      src,
      src_refs,
      enc_stat,
    };

    for (let key of Object.keys(map[char])) {
      if (map[char][key].length === 0) {
        delete map[char][key];
      }
    }
  }

  // write to file
  writeJSON(JSON.stringify(map), JSON_FILE_NAMES.readings);
};

export default main;
