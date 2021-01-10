// encapsulates getting and catching unihan data

import {
  UNIHAN_ZIP_URL,
  DATA_CACHE_DIR_NAME,
  METADATA_FILE_NAME,
  UNIHAN_SUBDIR_NAME,
} from "./constants";
import axios from "axios";
import progress from "progress";
import path from "path";
import fs from "fs";
import { createHash } from "crc-hash";
import moment from "moment";
import yauzl from "yauzl";

const HASH_ALGO = "crc32";

const getFileChecksum = async (path: string): Promise<string> => {
  return new Promise(function (resolve, reject) {
    const hash = createHash(HASH_ALGO);
    const input = fs.createReadStream(path);

    input.on("error", reject);

    input.on("data", function (chunk) {
      hash.update(chunk);
    });

    input.on("close", function () {
      resolve(hash.digest("hex"));
    });
  });
};

const DATA_CACHE_DIR = path.join(__dirname, DATA_CACHE_DIR_NAME);

if (!fs.existsSync(DATA_CACHE_DIR)) fs.mkdirSync(DATA_CACHE_DIR);

/* { date: 'Tue, 05 Jan 2021 03:35:26 GMT',
  server: 'Apache/2.4.38 (Debian)',
  'content-security-policy': 'upgrade-insecure-requests;',
  'last-modified': 'Wed, 19 Feb 2020 20:31:48 GMT',
  etag: '"6b7f63-59ef3ad763500"',
  'accept-ranges': 'bytes',
  'content-length': '7044963',
  connection: 'close',
  'content-type': 'application/zip' } */

type files = {
  [filename: string]: string; // sha256 hexdigest
};

type metadata = {
  files: files;
  lastModified: string;
};

function isMetadata(object: any): object is metadata {
  return (
    "files" in object &&
    "lastModified" in object &&
    moment(object.lastModified).isValid()
  );
}

const UNIHAN_SUBDIR = path.join(
  __dirname,
  DATA_CACHE_DIR_NAME,
  UNIHAN_SUBDIR_NAME
);

const UNIHAN_METADATA_FILE = path.join(UNIHAN_SUBDIR, METADATA_FILE_NAME);

const fetchUnihanData = async () => {
  let doFetch = false;

  if (!fs.existsSync(UNIHAN_SUBDIR)) {
    fs.mkdirSync(UNIHAN_SUBDIR);
  }

  try {
    if (!fs.existsSync(UNIHAN_METADATA_FILE)) throw new Error();
    const data = JSON.parse(fs.readFileSync(UNIHAN_METADATA_FILE).toString());
    if (!isMetadata(data)) throw new Error();
    console.log("Valid metadata file");
  } catch {
    console.error("Invalid metadata file");
    fs.writeFileSync(
      UNIHAN_METADATA_FILE,
      JSON.stringify({ files: {}, lastModified: moment(0).toLocaleString() })
    );
  }

  const metadata: metadata = JSON.parse(
    fs.readFileSync(UNIHAN_METADATA_FILE).toString()
  );

  console.log("Connecting …");
  const { data, headers } = await axios({
    url: UNIHAN_ZIP_URL,
    method: "GET",
    responseType: "stream",
  });

  console.log(headers);

  // validate all of the files hash
  try {
    for (let [filename, checksum] of Object.entries(metadata.files)) {
      const _checksum = await getFileChecksum(
        path.join(UNIHAN_SUBDIR, filename)
      );
      if (_checksum.toLowerCase() !== checksum.toLowerCase()) throw new Error();
    }
  } catch (e) {
    console.log(e);
    console.error("Checksum verification failed");
    doFetch = true;
  }

  // validate last modified
  if (moment(headers["last-modified"]) > moment(metadata.lastModified))
    doFetch = true;

  if (!doFetch) {
    console.log("Unihan data is valid and up to date.");
    return;
  } else {
    console.log("Fetching Unihan data.");
  }

  const totalLength = headers["content-length"];

  const progressBar = new progress("-> downloading [:bar] :percent :etas", {
    width: 40,
    complete: "=",
    incomplete: " ",
    renderThrottle: 1,
    total: parseInt(totalLength),
  });

  const fetchAndUnzip = () => {
    return new Promise<void>((resolve, reject) => {
      const outputFile = path.join(UNIHAN_SUBDIR, "Unihan.zip");
      const writer = fs.createWriteStream(outputFile);

      data.on("data", (chunk: string | any[]) =>
        progressBar.tick(chunk.length, {})
      );

      data.pipe(writer);

      data.on("end", () => {
        writer.close();
        metadata.lastModified = headers["last-modified"];
        // record the checksum of all the files from the zip spec
        metadata.files = {};

        yauzl.open(outputFile, { lazyEntries: true }, (err, file) => {
          console.log("file opened");

          file.on("entry", (entry) => {
            console.log(entry);
            const { fileName, crc32 } = entry;

            metadata.files[fileName] = crc32.toString(16); // convert to hex

            const writer = fs.createWriteStream(
              path.join(UNIHAN_SUBDIR, fileName)
            );

            file.openReadStream(entry, function (err, readStream) {
              if (err) throw err;
              readStream.on("end", function () {
                writer.close();
                file.readEntry();
              });
              readStream.pipe(writer);
            });
          });

          file.on("end", () => {
            resolve();
            // write metadata
            fs.writeFileSync(UNIHAN_METADATA_FILE, JSON.stringify(metadata));
            return;
          });

          file.readEntry();
        });
        // end of yauzl's unzipping
      });
      // end of file download callback
    });
    // promise block because the callback is synchronous
  };

  await fetchAndUnzip();
  console.log(metadata);
};

export const getRawIRGSources = async () => {
  // check if already downloaded
  await fetchUnihanData();
  // download with progress bar
};
