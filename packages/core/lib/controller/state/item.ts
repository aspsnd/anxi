export class StateItem<T = any>  {
  time = 0
  constructor(public left = 0, public infinite = false, public data?: T) {
    if (left < 1 && !infinite) throw new Error('The stateItem is not valid!');
  }

  disappearHandlers: ((data: T) => void)[] = []
  whenDisappear(...handlers: ((data: T) => void)[]) {
    this.disappearHandlers.push(...handlers);
  }

  destroyed = false
  destroy() {
    if (this.destroyed) return;
    for (const handler of this.disappearHandlers) {
      handler(this.data!);
    }
  }
}