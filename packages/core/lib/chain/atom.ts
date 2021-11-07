import { AttributeController } from "../controller/attribute";
import { Attribute } from "../controller/attribute/attribute";
import { Quark } from "./Quark";
export type Nullable<T extends {}, K extends keyof T> = {
  [key in K]?: T[key]
} & {
    [key in Exclude<keyof T, K>]: T[key]
  };

export interface AtomAttrBlock extends Record<string, number> {
  timeSpeed: number
  timeSlot: 0
}
export interface MoveStruct {
  old: number,
  value: number
}
/**
 * 默认自带AttributeController
 * 时间速度的实现方式改变为依赖于AttributeController
 */
export class Atom<A extends AtomAttrBlock = AtomAttrBlock> extends Quark{

  attribute: AttributeController

  private readonly _timeSlot_: Attribute<'timeSlot'>
  private readonly _timeSpeed_: Attribute<'timeSpeed'>
  get timeSlot() {
    return this._timeSlot_.value || 1;
  }
  get timeSpeed() {
    return this._timeSpeed_.value;
  }

  constructor(public baseAttrBlock: Nullable<A, 'timeSlot' | 'timeSpeed'> = {} as A) {
    super();
    baseAttrBlock = Object.assign({ timeSlot: 0, timeSpeed: 1 }, baseAttrBlock);
    this.attribute = new AttributeController(this, baseAttrBlock);
    const timeSlot = this._timeSlot_ = this.attribute.getAttr('timeSlot');
    const timeSpeed = this._timeSpeed_ = this.attribute.getAttr('timeSpeed');
    timeSlot.addCommonCaculator(() => {
      timeSlot.base = 1 / timeSpeed.value;
    });
    this.attribute.compute();
  }

}