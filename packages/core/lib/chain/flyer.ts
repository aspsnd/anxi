import { Bodies, Body } from "matter-js";
import { DisplayObject } from "pixi.js";
import { AnxiEvent } from "../event/event";
import { a2r } from "../util/math";
import { Atom } from "./atom";

interface AreaGetter {
  (x: number, y: number): Body
}

//TODO 将view层分离出成为单独的controller
export class Flyer extends Atom {
  constructor(public sprite: DisplayObject, initer?: (this: ThisType<Flyer>, flyer: Flyer) => void) {
    super({ timeSlot: 0, timeSpeed: 1 });
    initer?.call(this, this);
  }

  _x = 0
  _y = 0

  set x(x: number) {
    this.emit(new AnxiEvent('xchange', [this._x, x]));
    this.sprite.x = x;
    this._x = x;
  }

  set y(y: number) {
    this.emit(new AnxiEvent('ychange', [this._y, y]));
    this.sprite.y = y;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  static areaGetter = (x: number, y: number) => Bodies.circle(x, y, 5) as Body
  areaGetter = Flyer.areaGetter
  useAreaGetter(getter: AreaGetter) {
    this.areaGetter = getter;
    return this;
  }

  constSpeed: number | [number, number] = 0
  speedGetter?: (_time: number) => number
  useSpeed(speed: number | [number, number] | ((time: number) => number)) {
    if (typeof speed === 'number' || Array.isArray(speed)) {
      this.constSpeed = speed;
    } else {
      this.speedGetter = speed;
    }
    return this;
  }

  constDirection = 0
  directionGetter?: (_time: number) => number
  useDirection(angle: number | ((time: number) => number)) {
    if (typeof angle === 'number') {
      this.constDirection = angle;
    } else {
      this.directionGetter = angle;
    }
    return this;
  }

  ifCheck = (_time: number) => false
  useCheckTime(checker: number[] | boolean | ((_time: number) => boolean)) {
    if (typeof checker === 'boolean') {
      this.ifCheck = () => checker;
    } else if (Array.isArray(checker)) {
      this.ifCheck = () => checker.includes(this.time);
    } else {
      this.ifCheck = checker;
    }
    return this;
  }

  useAffectGetter() {
    //TODO
  }


  speed: number | number[] = 0
  direction: number = 0

  onTimer() {
    const speed = this.speed = this.speedGetter?.(this.time) ?? this.constSpeed;
    const direction = this.direction = this.directionGetter?.(this.time) ?? this.constDirection;
    this.sprite.angle = direction;
    if (Array.isArray(speed)) {
      this.x += speed[0];
      this.y += speed[1];
    } else {
      const radian = a2r(direction);
      let vx = speed * Math.cos(radian);
      let vy = speed * Math.sin(radian);
      this.x += vx;
      this.y += vy;
    }
    if (!this.ifCheck(this.time)) return;
    //TODO
  }
}