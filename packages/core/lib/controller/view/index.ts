import { Container } from "pixi.js";
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
    this.changeView(!!this.belonger!.world);
    this.belonger!.on('getworld', () => this.changeView(true));
    this.belonger!.on('loseworld', () => this.changeView(false));
  }
  onTime() {
    this.onRender();
  }

  changeView(add: boolean) {
    if (add) {
      this.belonger!.world!.container.addChild(this.container);
    } else {
      this.container?.parent?.removeChild(this.container);
    };
    return this._destroyed;
  }

  abstract onRender(): void
  action = undefined

  /**
   * 插入自定义的动画
   */
  abstract insertAction(_action: unknown): number
  abstract removeAction(_index: number): void
}