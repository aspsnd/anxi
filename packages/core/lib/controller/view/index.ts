import { Container } from "pixi.js";
import type { World } from "../../..";
import { Atom } from "../../chain/atom";
import { Controller } from "../controller";

export abstract class ViewController extends Controller {
  container = new Container()
  constructor(atom: Atom, lateInit = false) {
    super(atom, true);
    lateInit || this.init();
  }
  init() {
    super.init();
    const world = this.belonger as World;
    if (world.isWorld) {
      world.beforeContainer.addChild(this.container);
    } else {
      this.changeView(!!this.belonger!.world);
      this.belonger!.on('getworld', () => this.changeView(true));
      this.belonger!.on('loseworld', () => this.changeView(false));
    };
  }
  onTime(delta: number) {
    this.onRender(delta);
  }

  changeView(add: boolean) {
    if (add) {
      this.belonger!.world!.childContainer.addChild(this.container);
    } else {
      this.container?.parent?.removeChild(this.container);
    };
    return this._destroyed;
  }

  abstract onRender(delta: number): void
  action = undefined

  /**
   * 插入自定义的动画
   */
  abstract insertAction(_action: unknown): number
  abstract removeAction(_index: number): void
  destroy() {
    if (this._destroyed) return;
    this.container.destroy({
      children: true
    });
    super.destroy();
  }
}