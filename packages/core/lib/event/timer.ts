import { AnxiEvent } from "./event";
import { AnxiEventer } from "./eventer";

export class EnhancedTimer extends AnxiEventer {
  frame = 0
  constructor() {
    super();
  }
  onFrame(delta: number) {
    this.frame++;
    this.emit(new AnxiEvent('onframe', this.frame, delta));
    this.emit(new AnxiEvent(`frame_${this.frame}`, this.frame, delta));
  }

  waitFor(time: number, func: (frame: number) => void) {
    return this.once(`frame_${this.frame + time}`, _ => {
      func(this.frame);
    });
  }
  doUntil(until: number, func: (time: number) => void) {
    const begin = this.frame;
    return this.on('onframe', _ => {
      func(this.frame - begin);
      return this.frame - begin > until;
    });

  }
}