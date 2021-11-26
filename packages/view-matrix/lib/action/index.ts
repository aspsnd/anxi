import type { Quark, StateController } from "@anxi/core";
import { Matrix } from "@anxi/render"
import { standardize } from "./util";

// 可编写为plain json配置文件的格式
export type BaseActionValue = [x: number, y: number] |
[a: number, y: number, angle: number] |
[a: number, y: number, angle: number, mirror: boolean] |
[a: number, y: number, angle: number, scaleX: number, scaleY: number];

// 高度定制，可实现任意效果
export type CaculatorActionValue = (time: number, state: StateController, quark: Quark) => Matrix

export type ActionValue = BaseActionValue | CaculatorActionValue;

export type StandardActionValue = Matrix | CaculatorActionValue;

/**
* frames[0]应当为0,保证动画开始的状态
*/
export type Action = {
  length?: number,

  frames?: number[]
  value: ActionValue[]
}
export type ActionStruct = {
  [stateIndex: string]: {
    [comtIndex: string]: Action
    [comtIndex: number]: Action
  }
  [stateIndex: number]: {
    [comtIndex: string]: Action
    [comtIndex: number]: Action
  }
}
export type StandardAction = {
  length: number,
  value: StandardActionValue[]
}
export type StandardActionStruct = {
  [stateIndex: string | number]: StandardActionStructV1
}
export type StandardActionStructV1 = {
  [comtIndex: string | number]: StandardAction
}
export class ActionData {
  _standard?: StandardActionStruct
  get standard() {
    if (!this._standard) {
      this._standard = standardize(this.struct);
    }
    return this._standard!;
  }
  constructor(public struct: ActionStruct = {}) { }
  bind(stateIndex: string | number, comtIndex: string | number, action: Action) {
    if (!this.struct[stateIndex]) {
      this.struct[stateIndex] = {};
    }
    this.struct[stateIndex][comtIndex] = action;
  }
}