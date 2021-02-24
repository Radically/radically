import axios from "axios";
import fs from "fs";
import moment from "moment";
import path from "path";
import {
  BABELSTONE_PUA_JSON_NAME,
  BABELSTONE_PUA_JSON_URL,
  BABELSTONE_SUBDIR_NAME,
  DATA_CACHE_DIR_NAME,
} from "./constants";

const BABELSTONE_SUBDIR = path.join(
  __dirname,
  DATA_CACHE_DIR_NAME,
  BABELSTONE_SUBDIR_NAME
);

const BABELSTONE_PUA_FILE = path.join(
  BABELSTONE_SUBDIR,
  BABELSTONE_PUA_JSON_NAME
);

type PUAEntry = {
  cp: string;
  char: string;
  ids: string;
  note: string;
  src: string;
  src_refs: string;
  enc_stat: string;
};

type PUA = {
  data: PUAEntry[];
  ts: string;
};

const isValidBabelPUAFile = (obj: any) => {
  return "data" in obj && "ts" in obj && moment(obj.ts).isValid();
};

const fetchBabelData = async () => {
  if (!fs.existsSync(BABELSTONE_SUBDIR)) {
    fs.mkdirSync(BABELSTONE_SUBDIR);
  }

  try {
    if (!fs.existsSync(BABELSTONE_PUA_FILE)) throw new Error();

    const data = JSON.parse(fs.readFileSync(BABELSTONE_PUA_FILE).toString());

    if (!isValidBabelPUAFile(data)) throw new Error();
  } catch {
    console.error("Invalid Babelstone Han PUA file");
    fs.writeFileSync(
      BABELSTONE_PUA_FILE,
      JSON.stringify({
        data: [],
        ts: moment(0).toISOString(),
      })
    );
  }

  const data = JSON.parse(
    fs.readFileSync(BABELSTONE_PUA_FILE).toString()
  ) as PUA;

  console.log("Connecting …");

  const remoteData = (await axios.get<PUA>(BABELSTONE_PUA_JSON_URL)).data;

  if (moment(remoteData.ts) > moment(data.ts)) {
    fs.writeFileSync(BABELSTONE_PUA_FILE, JSON.stringify(remoteData));
  }
};

export const getPUAData = async (): Promise<PUA> => {
  await fetchBabelData();
  const buf = await fs.promises.readFile(BABELSTONE_PUA_FILE);
  return JSON.parse(buf.toString());
};
