import { addJapaneseShinKyu } from "./genVariants";
const IVS = require("ivs");

test("all ivs sequences stripped", (done) => {
  const ivs = new IVS(() => {
    const map = {} as { [key: string]: Set<number> };
    addJapaneseShinKyu(ivs, map);

    /* it appears innocuous, but the 違 in jp-old-style.txt
    is \u9055\udb40\udd02 (with an ivs sequence)
    the true assertions are the same character but
    without the \udb40\udd02 or similar 
    ivs selection sequences */
    expect("違󠄂" in map).toEqual(false);
    expect("違" in map).toEqual(true);

    expect("爲󠄀" in map).toEqual(false);
    expect("爲" in map).toEqual(true);
    done();
  });
});
