function waitPromise(time: number = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
};

export async function nextQueues<T>(array: Array<T>, iterator: (v: T, next: (result?: any) => Promise<void>) => Promise<void>, deferNext = false) {
  let i = 0;
  const len = array.length;
  async function next(result?: any) {
    if (i === len || result) return result;
    if (deferNext) await waitPromise(1);
    await iterator(array[i++], next);
  }
  return await next();
}