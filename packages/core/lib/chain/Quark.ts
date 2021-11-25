import { RelaxController } from "../controller/controller";
import { AnxiEvent } from "../event/event";
import { AnxiEventer } from "../event/eventer";
import type { World } from "./World";

export interface MoveStruct {
  old: number,
  value: number
}
/**
 * 最小的游戏描述对象
 * 具有时间速度，位移拦截，父子关系等概念
 */
export class Quark extends AnxiEventer<GlobalMixins.WholeQuarkEvents> {


  shadow<T extends RelaxController, K extends Exclude<keyof T['data'], symbol>>(constructor: new (...args: any[]) => T, method: `${'get' | 'lose'}${K}`, cb: (v: T['data'][K]) => void) {
    this.on(`$data_${constructor.name}_${method}`, e => {
      cb(e.data[0]);
    });
  }

  controllers: { [key: string]: RelaxController } = {}
  get<T extends RelaxController>(constructor: new (...args: any[]) => T): T {
    return this.controllers[constructor.name] as T;
  }
  remove<T extends RelaxController>(controller: T) {
    delete this.controllers[controller.name];
    controller.destroy();
  }

  private _timeSlot = 1
  get timeSlot() {
    return this._timeSlot;
  }
  set timeSlot(v: number) {
    this._timeSlot = v;
    this._timeSpeed = 1 / v;
  }

  private _timeSpeed = 1
  get timeSpeed() {
    return this._timeSpeed;
  }
  set timeSpeed(v: number) {
    this._timeSpeed = v;
    this._timeSlot = 1 / v;
  }

  constructor(timeSpeed = 1) {
    super();
    this._timeSlot = 1 / timeSpeed;
    this.initParent();
  }

  private initParent() {
    this.parentAgent.on('time', (e) => {
      return this._destroyed || this.onParentTime(e.data[1]);
    });
    this.parentAgent.once('destroy', () => {
      this.destroy();
    });
    this.on('loseparent', () => {
      this._parent!.releaseProxy(this.parentAgent);
    });
    this.on('getparent', () => {
      this._parent!.registerProxy(this.parentAgent);
    });
  }


  time = 0

  parentTime = 0
  lastParentTime = 0

  _lastGlobalTime = 0
  private onParentTime(gt: number) {
    this.parentTime++;
    while (this.parentTime - this.lastParentTime >= this.timeSlot) {
      this.lastParentTime += this.timeSlot;
      this.onTime(gt);
    }
  }

  onTime(gt: number) {
    if (!this.running) return;
    this._lastGlobalTime = gt;
    this.time++;
    this.emit(new AnxiEvent('time', this.time, gt));
    this.emit(new AnxiEvent(`time_${this.time}`, this.time, gt));

  }

  waitFor(time: number, func: (e: AnxiEvent) => void) {
    return this.once(`time_${this.time + time}`, func);
  }
  doUntil(until: number, func: (time: number) => void) {
    const begin = this.time;
    this.on('time', _ => {
      if (this.time - begin > until) {
        return true;
      } else {
        func(this.time - begin);
      }
    });
  }

  /**
   * Don't set this value simplely unless you want a bug.
   */
  private _parent?: Quark
  set parent(v: Quark | undefined) {
    if (this._parent) {
      this._parent.emit(new AnxiEvent('losechild', this));
      this.emit(new AnxiEvent('loseparent', this._parent));
      if (this.world) {
        this.world.emit(new AnxiEvent('loseatom', this));
        this.emit(new AnxiEvent('loseworld', this.world));
      }
    }
    if (!(this._parent = v)) return;
    this._parent.emit(new AnxiEvent('getchild', this));
    this.emit(new AnxiEvent('getparent', this._parent));
    if (!this.world) return;
    this.world.emit(new AnxiEvent('getatom', this));
    this.emit(new AnxiEvent('getworld', this.world));
  }
  get parent(): Quark {
    return this._parent!;
  }


  get world(): World | undefined {
    return (this.parent as unknown as World)?.isWorld ? this.parent as unknown as World : this.parent?.world;
  }

  private parentAgent = new AnxiEventer<any>();
  /**
   * 跟随父级时间，且自身时间速度有效
   * 父级destroy->自身destroy
   */
  land(parent: Quark) {
    this.parent = parent;
  }

  _destroyed = false;
  destroy() {
    if (this._destroyed) return;
    this._parent?.releaseProxy(this.parentAgent);
    for (const controller of Object.values(this.controllers)) {
      controller.destroy();
    }
    this._destroyed = true;
    this.on(new AnxiEvent('destroy'));
    this.removeListenersAbsolute();
  }

  // 是否时间冻结，表示时间停止，但仍存在
  private _running = true
  get running() {
    return this._running;
  }
  set running(bool: boolean) {
    if (this._running !== bool) {
      this._running = bool;
      this.on(new AnxiEvent('runchange', bool));
      if (bool) {
        this.on(new AnxiEvent('start'));
      } else {
        this.on(new AnxiEvent('stop'));
      }
    }
  }


  // 位置属性
  private _x = 0
  private _y = 0
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  set x(value) {
    if (Number.isNaN(value)) throw new Error('argsError');
    if (value == this._x) return;
    let oldX = this._x;
    let moveUtil = {
      old: oldX,
      value: value
    };
    this.on(new AnxiEvent('movex', moveUtil));
    this._x = moveUtil.value;
    this.on(new AnxiEvent('changex', this._x));
  }
  set y(value) {
    if (Number.isNaN(value)) throw new Error('argsError');
    if (value == this._y) return;
    let oldY = this._y;
    let moveUtil = {
      old: oldY,
      value: value
    };
    this.on(new AnxiEvent('movey', moveUtil));
    this._y = moveUtil.value;
    this.on(new AnxiEvent('changey', this._y));
  }
}