import { Atom, StateController, ViewController } from "@anxi/core";
import { Matrix, Sprite } from "pixi.js";
import { getCurrent } from "..";
import { ActionStruct, StandardActionStruct, ActionData } from "./action";

export type MatrixBaseAction = ActionStruct;

export type BodyStruct = {
  [bodyIndex: number]: Sprite
  [bodyIndex: string]: Sprite
}

export const enum MatrixViewerRenderType {
  FromState = 0,
  FromGetter = 1
}

export class MatrixViewer extends ViewController {

  actionSelector?: (atom: Atom, viewer: MatrixViewer) => [number, number]

  transform = new Matrix()
  baseAction: StandardActionStruct
  constructor(atom: Atom, baseAction: ActionData | ActionStruct) {
    super(atom);
    this.baseAction = baseAction instanceof ActionData ? baseAction.standard : new ActionData(baseAction).standard;
  }

  bodys: BodyStruct = {}
  from(bodys: BodyStruct) {
    this.bodys = bodys;
    for (const body of Object.values(bodys)) {
      if (!body.parent) {
        this.container.addChild(body);
      }
    }
  }
  renderType: MatrixViewerRenderType = MatrixViewerRenderType.FromState
  onRender(): void {
    this.container.transform.setFromMatrix(new Matrix().translate(this.belonger!.x, this.belonger!.y).append(this.transform));
    let stateIndex!: string | number, time!: number;
    if (this.renderType === MatrixViewerRenderType.FromState) {
      const state = this.belonger?.get(StateController).headState!;
      stateIndex = state.index;
      time = state.headTime;
    } else if (this.renderType === MatrixViewerRenderType.FromGetter) {
      [stateIndex, time] = this.actionSelector!(this.belonger!, this);
    }
    for (const bodyIndex in this.bodys) {
      let sprite = this.bodys[bodyIndex];
      let action = this.insertedAction?.[bodyIndex] || this.baseAction[stateIndex][bodyIndex] || this.baseAction[0][bodyIndex];
      if (!action) continue;
      const current = getCurrent(action, time);
      let result = current instanceof Function ? current(time, this.belonger!.get(StateController), this.belonger!) : current;
      sprite.transform.setFromMatrix(result);
    }
  }
  private _insertedActionIndex = 0
  private insertedAction?: StandardActionStruct[number | string]
  insertAction(action: StandardActionStruct[number | string]): number {
    // throw new Error("Method not implemented.");
    this._insertedActionIndex++;
    this.insertedAction = action;
    return this._insertedActionIndex;
  }
  removeAction(index: number): void {
    if (index !== this._insertedActionIndex) return;
    this.insertedAction = undefined;
  }

}