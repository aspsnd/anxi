import { AttributeController } from "../controller/attribute";
import { Attribute } from "../controller/attribute/attribute";
import { Controller } from "../controller/controller";
import { AnxiEvent } from "../event/event";
import { AnxiEventer } from "../event/eventer";
import type { World } from "./world";
type Nullable<T extends {}, K extends keyof T> = {
  [key in K]?: T[key]
} & {
    [key in Exclude<keyof T, K>]: T[key]
  };

export interface AtomAttrBlock extends Record<string, number> {
  timeSpeed: number
  timeSlot: 0
}
/**
 * 对标Unity的GameObject.
 * 默认自带AttributeController，并且拥有时间速度概念
 */
export class Atom<A extends AtomAttrBlock = AtomAttrBlock> extends AnxiEventer<GlobalMixins.WholeAtomEvents> {

  controllers: { [key: string]: Controller<Atom, any> } = {}
  get<T extends Controller>(constructor: new (...args: any[]) => T): T {
    return this.controllers[constructor.name] as T;
  }
  remove<T extends Controller>(controller: T) {
    controller.destroy();
    delete this.controllers[controller.name];
  }

  attribute: AttributeController

  private _timeSlot: Attribute<'timeSlot'>
  private _timeSpeed: Attribute<'timeSpeed'>
  get timeSlot() {
    return this._timeSlot.value || 1;
  }
  get timeSpeed() {
    return this._timeSpeed.value;
  }

  constructor(public baseAttrBlock: Nullable<A, 'timeSlot' | 'timeSpeed'> = {} as A) {
    super();
    baseAttrBlock = Object.assign({ timeSlot: 0, timeSpeed: 1 }, baseAttrBlock);
    this.attribute = new AttributeController(this, baseAttrBlock);
    const timeSlot = this._timeSlot = this.attribute.getAttr('timeSlot');
    const timeSpeed = this._timeSpeed = this.attribute.getAttr('timeSpeed');
    timeSlot.addCommonCaculator(() => {
      timeSlot.base = 1 / timeSpeed.value;
    });
    this.attribute.compute();
  }

  time = 0

  frame = 0
  lastTimeFrame = 0

  onFrame(delta: number) {
    this.frame++;
    while (this.frame - this.lastTimeFrame >= this.timeSlot) {
      this.lastTimeFrame += this.timeSlot;
      this.onTime(delta);
    }
  }

  onTime(delta: number) {
    if (!this.running) return;
    this.time++;
    this.emit(new AnxiEvent('time', this.time, delta));
    this.emit(new AnxiEvent(`time_${this.time}`, this.time, delta));

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
  _parent?: Atom
  set parent(v: Atom | undefined) {
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
  get parent(): Atom {
    return this._parent!;
  }


  get world(): World | undefined {
    return (this.parent as unknown as World)?.isWorld ? this.parent as unknown as World : this.parent?.world;
  }

  /**
   * 跟随父级时间，且自身时间速度有效
   * 父级destroy->自身destroy
   */
  land(parent: Atom) {
    this.parent = parent;
    parent.on('time', (e) => {
      return this._destroyed || this.onFrame(e.data[1]);
    });
    parent.on('destroy', () => {
      this.destroy();
    })
  }

  _destroyed = false;
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    this.on(new AnxiEvent('destroy'));
    this.removeListenersAbsolute();
  }

  // 是否时间冻结，表示时间停止，但仍存在
  _running = true
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
  _x = 0
  _y = 0
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