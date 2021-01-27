import { getRawIRGSources } from "./unihan-fetcher";
import { writeJSON } from "./writer";

import { JSON_FILE_NAMES } from "../src/constants";

const main = async () => {
  const IRGSourcesString = (await getRawIRGSources()).split("\n");
  const map = {} as StrokeCountMap;
  for (let entry of IRGSourcesString) {
    if (entry.startsWith("#")) continue;
    let split = entry.split("\t");
    if (split[1] !== "kTotalStrokes") continue;
    const char = String.fromCodePoint(parseInt(split[0].substr(2), 16));
    map[char] = parseInt(split[2]);
  }

  // write to file
  writeJSON(JSON.stringify(map), JSON_FILE_NAMES.strokeCount);
};

export default main;
