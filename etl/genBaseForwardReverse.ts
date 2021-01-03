export function sum(a: number, b: number) {
  return a + b;
}

import { getRawIRGSources } from './fetcher';

const processIDSText = (text: string) => {
  const forwardMap = {};
  let reverseMap = {}; // char:  { utf_code: U+0000, ids_strings: [{ids: decomp1, locales: 'GT'}, {ids: decomp2, locales: 'JK'}] }
  const baseRadicals = new Set();
  const metadata = {
    entries: 0,
    unique_radicals: 0,
    date: new Date(),
  };
  const split = text.split("\n");
}

const main = async () => {
  await getRawIRGSources();
}

export default main;