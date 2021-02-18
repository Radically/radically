/* ./worker/custom.d.ts */

declare module "comlink-loader!*" {
  class WebpackWorker extends Worker {
    constructor();

    // Add any custom functions to this class.
    // Make note that the return type needs to be wrapped in a promise.
    processData(data: string): Promise<string>;

    performComponentQuery(
      forwardMap: ForwardMap,
      reverseMapCharFreqsOnly: ReverseMapCharOnly,
      components: string,
      // idcs: string,
      atLeastComponentFreq: boolean
    ): Promise<Set<string>>;

    filterUsingIDCs(
      reverseMapIDSOnly: ReverseMapIDSOnly,
      results: string[],
      _idcs: string
    ): Promise<string[]>
  }

  export = WebpackWorker;
}
