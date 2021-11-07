import { Quark } from "../chain/Quark";
import { AnxiEventer, BEN } from "../event/eventer";


export interface RelaxController<D extends {} = {}> {
  eventer: AnxiEventer<GlobalMixins.WholeQuarkEvents>
  data: ControllerData<D>
  signal: ControllerDataSignal<D>
  belonger?: Quark
  name: string
  init(): void
  onTime(_delta: number): void
  destroy(): void
}

export class Signal<T> {
  private cbs: Set<(v: T) => void> = new Set()
  add(func: (v: T) => void) {
    this.cbs.add(func);
  }
  delete(func: (v: T) => void) {
    this.cbs.delete(func);
  }
  emit(v: T) {
    for (const cb of this.cbs) {
      cb(v);
    }
  }
}
export type ControllerData<T extends Record<string, any> = {}> = {
  [key in keyof T]: T[key] | undefined
}
export type ControllerDataSignal<T extends Record<string, any> = {}> = {
  [key in keyof T]: {
    get: Signal<T[key]>
    lose: Signal<T[key]>
  }
}
/**
 * 控制器的抽象
 * Controller的整个生命周期都必须挂载在Quark上
 */
export class Controller<D extends Record<string, any> = {}, EN extends BEN = BEN> extends AnxiEventer<EN> implements RelaxController<D> {
  private _data_: ControllerData<D> = {} as ControllerData<D>
  data: ControllerData<D> = {} as ControllerData<D>
  signal!: ControllerDataSignal<D>
  eventer = new AnxiEventer<GlobalMixins.WholeQuarkEvents>()
  belonger: Quark
  name: string
  constructor(belonger: Quark, lateInit = false) {
    super();
    this.name = new.target.name;
    this.belonger = belonger;
    this.addInQuark(belonger);
    this.belonger.registerProxy(this.eventer);
    lateInit || this.init();
  }
  init() {
    this.eventer.on('time', e => {
      this.onTime(e.data[1]);
    })
  }
  initDataAndSignal() {
    const self = this;
    for (const k in this.data) {
      this._data_[k] = this.data[k];
      Object.defineProperty(this.data, k, {
        get() {
          return self._data_[k];
        },
        set(v) {
          const last = self._data_[k];
          if (last !== undefined && last !== null) {
            self.signal[k].lose.emit(last!);
          }
          self._data_[k] = v;
          self.signal[k].get.emit(v);
        }
      })
      this.signal[k] = {
        get: new Signal(),
        lose: new Signal()
      }
    }
  }

  private addInQuark(atom: Quark) {
    atom.controllers[this.name] = this;
  }

  onTime(_delta: number) { }

  _destroyed = false;
  destroy() {
    if (this._destroyed) return;
    this.removeListenersAbsolute();
    this.belonger?.releaseProxy(this.eventer);
  }
}