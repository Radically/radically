# Radically

## You may also like
- [Unicode-only IDS data](https://github.com/Transfusion/cjkvi-ids-unicode)
- [Hanazono Lite](https://radically.github.io/hanazonolite/)

## Lookup Preprocessing Algorithm

A basic implementation of a lookup system from constituent radical to character is simple - depth first search starting from the root node, adding every encountered character in every IDS string into a hash table / dictionary / similar data structure. Indeed, this is done in this project.

```
車 -> 蓮,櫣,輿,轉 ...
车 -> 莲,舆,转 ...
```

The complication arises if we want to include radical frequency in our search - e.g. "find all characters with at least 3 occurrences of 人" should return 傘, 众, and 齒, but not 从, 纵, 齿, etc.

![Decomposition of 蓮](https://i.imgur.com/i5tKHcj.png)

- There may be more than one IDS string, and thus decomposition per character.
- The total number of characters in each head to leaf node path varies, as does the number of unique characters. We may (and I have!) run into a character with a very elaborate decomposition if we take a particular branch, and a decomposition that terminates early on another[<sup>1</sup>](#ref_1).

The approach taken is to generate a list of the powerset[<sup>2</sup>](#ref_2) of radicals for every possible head to leaf node path, EXCLUDING THE ROOT ITSELF (important!), e.g. the expected output would be

```
[
  { '艹': 1, '連': 1, '辶': 1, '車': 1, '十': 1, '丨': 1 },
  { '艹': 1, '連': 1, '辶': 1, '車': 1, '十': 2 },
  { '辶': 1, '莗': 1, '艹': 1, '車': 1, '十': 1, '丨': 1 },
  { '辶': 1, '莗': 1, '艹': 1, '車': 1, '十': 2 }
]
```

where there are 4 sets, or rather hash tabless, depicted by the 4 different colors above. The one in green corresponds to the 1st item in the list.

Define a recursive function, `rec(char)`, where `char` is a single character and the output is as described above.

Taking the left branch from the root, 艹 can be decomposed into either 十十 or 十丨, hence `rec(艹) -> [ { '十': 1, '丨': 1 }, { '十': 2 } ]`, and similarly, `rec(連) -> [ { '辶': 1, '車': 1 } ]`.

The key observation is that for each character in an IDS string, we must pick 1 set from its list of sets before merging 1 set per character into a bigger set, to avoid double-counting radicals. Ergo, we must find the **cartesian product** between the powersets of each constituent character, then merge each resulting n-tuple.

Hence, the powersets of the IDS string 十連, although not explicitly defined here, are `[ { '十': 1, '丨': 1, '辶': 1, '車': 1 }, { '十': 2, '辶': 1, '車': 1 } ]`.

Define another function `mergeTwoFreqs(powersetA, powersetB)` which merges two powersets together, adding the frequencies together if they are in both sets. Merging 3 or more sets is done by `mergeTwoFreqs(powersetA, mergeTwoFreqs(powersetB, powersetC)...`

Note how the first item of `rec(艹)`, and then the second item, is merged with the only item of `rec(連)` in turn. In other words, for a given IDS string `ABC`, where `rec(A) -> [ A0, A1, A2 ]`, `rec(B) -> [ B0, B1, B2 ]`, and `rec(C) -> [ C0, C1, C2 ]`, i.e. this is a permutation generation problem where we need to generate `[ mergeFreqs((A0, B0, C0)), mergeFreqs((A0, B0, C1)), ... mergeFreqs((A2, B2, C2)) ]`.

Define another function `permGen(n-tuple[])` which takes the length of each n-tuple and outputs `int[]` describing each permutation by their indices, e.g. `[ [0,0,0], [0,0,1], ... [2,2,2] ]` (keep on reading!)

Now, the only thing left to do is to merge _the powersets of the IDS string_, with the frequencies of the _IDS string itself_.

Going back to our example where the two powersets of 艹蓮 are `[ { '十': 1, '丨': 1, '辶': 1, '車': 1 }, { '十': 2, '辶': 1, '車': 1 } ]`, we need to merge each of the powersets with `{ '艹': 1, '連': 1 }` using `mergeTwoFreqs` to get two possible powersets for 蓮, namely,

```
[
  { '艹': 1, '連': 1, '辶': 1, '車': 1, '十': 1, '丨': 1 },
  { '艹': 1, '連': 1, '辶': 1, '車': 1, '十': 2 },
]
```

We do the same for the right subtree, to get the blue and green powersets.

```
[
  { '辶': 1, '莗': 1, '艹': 1, '車': 1, '十': 1, '丨': 1 },
  { '辶': 1, '莗': 1, '艹': 1, '車': 1, '十': 2 }
]
```

Finally, we append the left and right subtree results immediately above into a list, and flatten it to obtain our expected result far above.

The termination condition, i.e. a leaf node is considered to be a leaf node when the IDS string(s) contain only itself, i.e. there are no constituent characters, and thus we return an empty list of powersets.

Once again, in pseudocode:

```
def mergeTwoFreqs(freqsA, freqsB) {
    res = { ...freqsB };
    for (let char of Object.keys(freqsA)) {
        if (!res[char]) res[char] = 0;
        res[char] += freqsA[char];
    }
    return res;
};

// given [ [ A0, A1, A2 ], [ B0, B1, B2 ], [ C0, C1, C2 ] ], return [ mergeFreqs((A0, B0, C0)), mergeFreqs((A0, B0, C1)), ... mergeFreqs((A2, B2, C2)) ]
// A0 .. C2 are *powersets*.
def permuteAndMerge(freqsArr) {
    // [ [0,0,0], [0,0,1], ... [2,2,2] ]
    permutations = permGen(freqsArr.map(getSize))

    res = []
    for permutation in permutations {
        mergedPowerset = {}
        // take one from each powerset
        elements = permutation.map((elem, i) => freqsArr[i][elem])
        for element in elements {
            mergedPowerset = mergeTwoFreqs(mergedPowerset, element)
        }
        res.append(mergedPowerset)
    }
    return res
}

def rec(char) {
    // each index on this array corresponds to a fork in the black arrow, i.e. a different decomposition in the picture above
    freqsAtThisNode = []

    // ['⿰木⿺辶莗', '⿰木蓮']
    idsStrings = getIDSStrings(char)

    // record the frequencies of each IDS string
    // itself in the array
    for i = 0; i < idsStrings.length; i++ {
        freqsAtThisNode.append({});
        for idsChar in idsStrings[i] {
            if idsChar !== char and isValidHanChar(char) {
                if (!freqsAtThisNode[i][idsChar]) {
                    freqsAtThisNode[i][idsChar] = 0;
                }
                freqsAtThisNode[i][idsChar] += 1;
            }
        }
    }

    res = []
    for i = 0; i < idsStrings.length; i++ {
        // eureka
        freqs = permuteAndMerge(Object.keys(freqsAtThisNode[i]).map((key) => rec(key)))
        // merge the powersets with the freqs of the corresponding IDS string
        freqs = freqs.map((freq) => mergeTwoFreqs(freq, freqsAtThisNode[i]))
        // flatten
        res = res.concat(freqs)
    }
    return res
}
```

N.B. if there are no valid characters in the IDS string, `freqs` in the 2nd for loop will be empty, and it will vanish during flattening.

<a name="ref_1">[1]</a> AFAIK, there is a lot of human subjectivity involved in the CHISE IDS dataset.

<a name="ref_2">[2]</a> "Powerset" here refers to a hash table, the keys of which are **ALL** the constituent radicals of a particular character as we traverse the tree, and the values of which are their frequencies. I refer to this concept as `freqs` in the code often.

## Generated Datasets

These JSON datasets are generated by `npm run etl` using [my preprocessed IDS data](https://github.com/Transfusion/cjkvi-ids-unicode) and output into the `public/json` folder for consumption by the frontend.

**baseRadicals.json**: `string[]`, a list of radicals which cannot be further decomposed.

**forwardMap.json**: `{  [key: string]: string[];  }`, a map of component to characters that it is present in.

**variantsIslandsLookup.json**: `{  islands: string[][];  chars: { [key: string]: number[] };   }`, `islands` is a list of lists of related characters. `chars` is a map of individual character to the index in `islands` of the island containing itself.

**variantsMap.json**: `{  [key: string]: number[]; }`, map of character to list of types that it is classified as (e.g. Shinjitai, Simplified Chinese)

**readings.json**: `{  [key: string]: {    [key: string]: string;  }; }`, map of character to Unihan reading fields.

**reverseMap.json** (large! >150MB. Not actually used by the frontend directly.):
```
{
  [key: string]: {
    utf_code: string;
    ids_strings: {
      ids: string;
      locales: string;
    }[];
    charFreqs?: powerset[];
  };
}
```

`ids_strings` is a list of IDSs and the locales that this IDS decomposition corresponds to.

Refer above[<sup>2</sup>](#ref_2) for what a "powerset" means here.

**reverseMapCharFreqsOnly.json** and **reverseMapIDSOnly.json** are optimized versions of **reverseMap.json** in order to fit within Apple's 50MB service worker cache limit for PWAs.

## Rules of thumb

The IDS sequences as provided by CHISE use Kangxi radicals and their actual CJK character counterparts interchangeably.

[Decomposition which uses U+2E81 (Kangxi radical)](https://gitlab.chise.org/CHISE/ids/-/blob/abb8c1ae25a9e6360e8629c35b8e3e06dd38f62d/IDS-UCS-Ext-B-2.txt#L5511)

[Decomposition which uses U+20086 (CJK character)](https://gitlab.chise.org/CHISE/ids/-/blob/abb8c1ae25a9e6360e8629c35b8e3e06dd38f62d/IDS-UCS-Basic.txt#L16170)

All Kangxi radicals are converted to their corresponding CJK characters as part of the ETL process.

All variants of a character, including transitive ones, should be retrivable from any of the characters involved. e.g. searching for 发 (SC) should return 發 (TC), 髮 (TC), 発 (JA), and searching for 鄕 (KR) should return 郷 (JA), 鄉 (TC), and 乡 (SC), along with other less-commonly used variants.

## Licenses

`SPDX-License-Identifier: GPL-2.0-or-later`

- The products of `npm run etl` (most of the files in the `public/json` folder) are licensed under the GNU General Public License v2.0 or later.
    - This applies to the currently deployed version.
    - They are derived from CHISE and the [Kanji Database Project](http://kanji-database.sourceforge.net/index.html), which use the GPLv2, via [my preprocessed IDS data](https://github.com/Transfusion/cjkvi-ids-unicode).

- I have plans to dual-license Radically under the MIT license.
    - The main obstacles are the lack of a non-copyleft, small, 100% CJK Unicode coverage webfont, and most of the `etl` folder relying on said GPLv2 licensed data. 
    - You are more than welcome to contact me via email, the chat links above, or opening an issue if you have a need to use (parts of) it, or the algorithm in non-copyleft settings.
    - If you wish to contribute to Radically, please keep this in consideration.
