import { Application, IApplicationOptions } from "pixi.js";
import { EnhancedTimer } from "../event/timer";

export interface IAppOptions extends IApplicationOptions {
  eventer?: EnhancedTimer
}

export class App extends Application {
  eventer: EnhancedTimer
  constructor(public options: IAppOptions) {
    super(options);
    this.eventer = options.eventer ?? new EnhancedTimer();
    this.ticker.add(this.eventer.onFrame.bind(this.eventer));
  }
  resize(): void
  resize(width: number, height: number): Promise<void>
  resize(...args: [] | [number, number]) {
    if (args.length === 0) {
      return super.resize();
    } else {
      return new Promise(resolve => {
        this.renderer.resize(...args);
        this.eventer.waitFor(1, () => {
          this.stage.width = args[0];
          this.stage.height = args[1];
          this.eventer.on('appresized');
          resolve(0);
        });
      })
    }
  }
}