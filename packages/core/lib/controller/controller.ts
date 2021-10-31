import { Atom } from "../chain/atom";
import { AnxiEventer, BEN } from "../event/eventer";


export interface RelaxController {
  eventer: AnxiEventer<GlobalMixins.WholeAtomEvents>
  belonger?: Atom
  name: string
  init(): void
  refresh(): void
  onTime(_delta: number): void
  destroy(): void
}
/**
 * 控制器的抽象
 */
export class Controller<T extends Atom = Atom, EN extends BEN = BEN> extends AnxiEventer<EN> {
  eventer = new AnxiEventer<GlobalMixins.WholeAtomEvents>()
  belonger?: T
  name: string
  constructor(belonger: T, lateInit = false) {
    super();
    this.name = new.target.name;
    this.belonger = belonger;
    this.addInAtom(belonger);
    this.belonger.registerProxy(this.eventer);
    lateInit || this.init();
  }
  init() {
    this.eventer.on('time', e => {
      this.onTime(e.data[1]);
    })
  }

  private addInAtom(atom: Atom) {
    atom.controllers[this.name] = this;
  }

  /**
   * 实现控制器的部分复用，可用来在退出进入下一关卡时刷新Atom状态，而不是重头部署。
   */
  refresh() {

  }
  onTime(_delta: number) { }

  removed = false;
  remove(destroy = true) {
    if (!this.belonger) return;
    this.belonger.releaseProxy(this.eventer);
    this.removed = true;
    this.belonger = undefined;
    destroy && this.destroy();
  }
  _destroyed = false;
  destroy() {
    if (this._destroyed) return;
    this.removeListenersAbsolute();
    this.belonger?.releaseProxy(this.eventer);
  }
}