import {
  DATA_CACHE_DIR_NAME,
  METADATA_FILE_NAME,
  UNICODE_IDS_SUBDIR_NAME,
  UNICODE_IDS_DATABASE_BASE_URL,
  UNICODE_IDS_DATABASE_URL,
} from "./constants";
import axios from "axios";
import path from "path";
import fs from "fs";
import moment from "moment";

enum ids_resolution_status {
  original = "original",
  resolved = "resolved",
  entities_resolved = "entities_resolved",
  manually_resolved = "manually_resolved",
  manually_partially_resolved = "manually_partially_resolved",
  unresolved = "unresolved",
  unresolvable = "unresolvable",
}

type ids_resolution_status_fields = {
  file: string;
  size: number;
  entries: number;
};

type unicode_ids_metadata_ids_data = {
  original: ids_resolution_status_fields;
  resolved?: ids_resolution_status_fields;
  entities_resolved?: ids_resolution_status_fields;
  manually_resolved?: ids_resolution_status_fields;
  manually_partially_resolved?: ids_resolution_status_fields;
  unresolved?: ids_resolution_status_fields;
  unresolvable?: ids_resolution_status_fields;
  metadata: {};
};

type unicode_ids_metadata = {
  ids_data: { [key: string]: unicode_ids_metadata_ids_data };
  ts: string;
};

const UNICODE_IDS_SUBDIR = path.join(
  __dirname,
  DATA_CACHE_DIR_NAME,
  UNICODE_IDS_SUBDIR_NAME
);

const UNICODE_IDS_METADATA_FILE = path.join(
  UNICODE_IDS_SUBDIR,
  METADATA_FILE_NAME
);

// the metadata file is of the format
// https://transfusion.github.io/cjkvi-ids-unicode/metadata.json
export const getAvailableIDSData = async (): Promise<string[]> => {
  let doFetch = false;

  if (!fs.existsSync(UNICODE_IDS_SUBDIR)) {
    fs.mkdirSync(UNICODE_IDS_SUBDIR);
  }

  try {
    if (!fs.existsSync(UNICODE_IDS_METADATA_FILE)) throw new Error();
    console.log("Valid IDS metadata file");
  } catch {
    console.log("Invalid IDS metadata file");
    fs.writeFileSync(
      UNICODE_IDS_METADATA_FILE,
      JSON.stringify({ ids_data: {}, ts: "19000122T163358.543184Z" })
    );
  }

  const metadata: unicode_ids_metadata = JSON.parse(
    fs.readFileSync(UNICODE_IDS_METADATA_FILE).toString()
  );

  // my metadata.json
  console.log("Connecting …");
  const {
    data: { ids_data, ts },
  } = await axios.get<unicode_ids_metadata>(UNICODE_IDS_DATABASE_URL);

  if (moment(ts) > moment(metadata.ts)) doFetch = true;

  if (!doFetch) {
    console.log("Unicode IDS data is valid and up to date");
    return Object.keys(metadata.ids_data);
  } else {
    console.log("Fetching Unihan data");
  }

  if (doFetch) {
    fs.readdirSync(UNICODE_IDS_SUBDIR)
      .filter((f) => /[.]txt$/.test(f))
      .map((f) => fs.unlinkSync(path.join(UNICODE_IDS_SUBDIR, f)));
  }

  // download everything

  for (let filename in ids_data) {
    console.log("Fetching " + filename);
    const idsDataFile = ids_data[filename];
    let { data } = await axios.get(
      UNICODE_IDS_DATABASE_BASE_URL + `/${idsDataFile.original.file}`
    );

    fs.writeFileSync(
      path.join(UNICODE_IDS_SUBDIR, idsDataFile.original.file),
      data
    );

    for (let resolution_status of [
      "resolved",
      "entities_resolved",
      "manually_resolved",
      "manually_partially_resolved",
      "unresolved",
      "unresolvable",
    ]) {
      if (idsDataFile.hasOwnProperty(resolution_status)) {
        ({ data } = await axios.get(
          UNICODE_IDS_DATABASE_BASE_URL +
            `/${idsDataFile[resolution_status as ids_resolution_status].file}`
        ));

        fs.writeFileSync(
          path.join(
            UNICODE_IDS_SUBDIR,
            idsDataFile[resolution_status as ids_resolution_status].file
          ),
          data
        );
      }
    }
    // write metadata
    fs.writeFileSync(
      UNICODE_IDS_METADATA_FILE,
      JSON.stringify({ ids_data, ts })
    );
  }

  return Object.keys(ids_data);
};
