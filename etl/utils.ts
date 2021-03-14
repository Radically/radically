import v8 from "v8";

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
