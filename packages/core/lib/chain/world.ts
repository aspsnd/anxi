import { Container, TickerCallback, Application } from 'pixi.js';
import { Atom } from "./atom";

export class World extends Atom {
  time = 0
  frame = 0
  isWorld = true
  container = new Container()
  ticker?: TickerCallback<void>
  app?: Application
  bind(app: Application, stage: Container) {
    this.app = app;
    this.ticker = (delta: number) => this.onFrame(delta);
    app.ticker.add(this.ticker);
    stage.addChild(this.container);
    return this;
  }
  destroy() {
    this.ticker && this.app?.ticker.remove(this.ticker);
    super.destroy();
  }
}