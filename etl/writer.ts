import fs from "fs";
import path from "path";

const JSON_DIR = path.join(__dirname, "../public/json");
if (!fs.existsSync(JSON_DIR)) fs.mkdirSync(JSON_DIR);

export const writeJSON = (json: string, fileName: string) => {
  fs.writeFileSync(path.join(JSON_DIR, fileName), json);
};
