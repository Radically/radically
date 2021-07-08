import v8 from "v8";
import { StrokePlaceholderSet } from "../src/constants";

export function structuredClone<T>(obj: T): T {
  return v8.deserialize(v8.serialize(obj));
}

export function isPUA(char: string) {
  const cp = char.codePointAt(0)!;
  return (
    (cp >= parseInt("E000", 16) && cp <= parseInt("F8FF", 16)) ||
    (cp >= parseInt("F0000", 16) && cp <= parseInt("FFFFD", 16)) ||
    (cp >= parseInt("100000", 16) && cp <= parseInt("10FFFD", 16))
  );
}

/**
 * Only used for the function below this one
 * @param char a character
 */
export function isValidIDSCharacter(idsChar: string) {
  // if (IDCSet.has(idsChar)) return false;
  if (StrokePlaceholderSet.has(idsChar)) return false;
  // ignore all ascii
  if (idsChar.charCodeAt(0) < 127) return false;
  if (idsChar === "？") return false;
  return true;
}

/**
 * Checks if the given IDS doesn't contain any invalid characters like ascii, question mark, placeholders.
 * @param ids
 * @returns
 */
export function isValidIDS(ids: string) {
  for (let i = 0; i < ids.length; i++) {
    if (!isValidIDSCharacter(ids[i])) return false;
  }
  return true;
}
