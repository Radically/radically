/*

Queue.ts

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

Modified by Bryan Kok <bryan.wyern1@gmail.com>
*/

export default class Queue<T> {
  queue: T[];
  offset: number;

  // Returns the length of the queue.
  getLength() {
    return this.queue.length - this.offset;
  }

  // Returns true if the queue is empty, and false otherwise.
  isEmpty() {
    return this.queue.length == 0;
  }

  /* Enqueues the specified item. The parameter is:
   *
   * item - the item to enqueue
   */
  enqueue(item: T) {
    this.queue.push(item);
  }

  /* Dequeues an item and returns it. If the queue is empty, the value
   * 'undefined' is returned.
   */
  dequeue() {
    // if the queue is empty, return immediately
    if (this.queue.length == 0) return undefined;

    // store the item at the front of the queue
    var item = this.queue[this.offset];

    // increment the offset and remove the free space if necessary
    if (++this.offset * 2 >= this.queue.length) {
      this.queue = this.queue.slice(this.offset);
      this.offset = 0;
    }

    // return the dequeued item
    return item;
  }

  /* Returns the item at the front of the queue (without dequeuing it). If the
   * queue is empty then undefined is returned.
   */
  peek() {
    return this.queue.length > 0 ? this.queue[this.offset] : undefined;
  }

  constructor() {
    // initialise the queue and offset
    this.queue = [];
    this.offset = 0;
  }
}
