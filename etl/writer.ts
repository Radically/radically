import fs from "fs";
import path from "path";
import protobuf from "protobufjs";
import pako from "pako";

const JSON_DIR = path.join(__dirname, "../public/json");
if (!fs.existsSync(JSON_DIR)) fs.mkdirSync(JSON_DIR);

export const writeJSON = (json: string, fileName: string) => {
  fs.writeFileSync(path.join(JSON_DIR, fileName), json);
};

export const writeData = (
  data: string | Buffer | Uint8Array,
  filename: string
) => {
  fs.writeFileSync(path.join(JSON_DIR, filename), data);
};

// https://stackoverflow.com/questions/44328792/protobuf-js-translate-proto-file-to-json-descriptor-repeated-gets-lost

// https://stackoverflow.com/questions/48201347/protobuf3-why-repeated-map-is-not-allowed

/* sample
const data = {
  data: {
    叚: {
      utf_code: "U+53DA",
      ids_strings: [{ ids: "⿰石殳", locales: null }],
      charFreqs: [
        {
          m: { 石: 1, 殳: 1, "𠘧": 1, 又: 1, 丆: 1, 口: 1, 一: 1, 丿: 1 },
        },
        {
          m: { 石: 1, 殳: 1, 几: 1, 又: 1, 丆: 1, 口: 1, 一: 1, 丿: 1 },
        },
      ],
    },
    开: {
      utf_code: "U+53DA",
      ids_strings: [
        { ids: "⿰石殳", locales: "GTK" },
        { ids: "foo", locales: "bar" },
      ],
      charFreqs: [
        {
          m: { 石: 1, 殳: 1, "𠘧": 1, 又: 1, 丆: 1, 口: 1, 一: 1, 丿: 1 },
        },
        {
          m: { 石: 1, 殳: 1, 几: 1, 又: 1, 丆: 1, 口: 1, 一: 1, 丿: 1 },
        },
      ],
    },
  },
};
*/

export const writeReverseMapProtobuf = (
  buffer: Uint8Array,
  fileName: string
) => {
  fs.writeFileSync(path.join(JSON_DIR, fileName), buffer);
};
