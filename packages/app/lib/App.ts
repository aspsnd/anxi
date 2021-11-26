import { World } from "@anxi/core";
import { RendererOptions, RendererViewController } from "@anxi/view";
import { Ticker } from "./ticker";

export interface AppOptions extends RendererOptions {
  logicalFPS?: number
  renderFPS?: number
  logicalTicker?: Ticker
  renderTicker?: Ticker
  skipLogicalTickerInit?: boolean
  skipRenderTickerInit?: boolean
}
/**
 * 更便捷的使用Anxi.
 * 内置了根World节点、根渲染控制器、逻辑帧率、渲染帧率功能
 */
export class App {
  readonly world = new World()
  readonly renderer: RendererViewController
  constructor(public readonly options: AppOptions = {}) {
    this.renderer = new RendererViewController(this.world, options);
    this.initLogicalFrame();
    this.initRenderFrame();
    
  }
  initLogicalFrame() {
    if (this.options.skipLogicalTickerInit) return;
    let ticker: Ticker | undefined;
    if (ticker = this.options.logicalTicker) {
      ticker.add(() => {
        this.world.onTime(ticker!.lastTime);
      });
      return;
    }
    ticker = new Ticker(this.options.logicalFPS || 60);
    ticker.add(() => {
      this.world.onTime(ticker!.lastTime);
    });
    this.options.logicalTicker = ticker;
    ticker.start();
  }
  initRenderFrame() {
    if (this.options.skipRenderTickerInit) return;
    let ticker: Ticker | undefined;
    if (ticker = this.options.renderTicker) {
      ticker.add(() => {
        this.renderer.onFrame();
      });
      return;
    }
    ticker = new Ticker(this.options.renderFPS || 60);
    ticker.add(() => {
      this.renderer.onFrame();
    });
    this.options.renderTicker = ticker;
    ticker.start();
  }
  destroy() {
    this.options.logicalTicker?.destroy();
    this.options!.renderTicker?.destroy();
    this.world.destroy();
  }
}