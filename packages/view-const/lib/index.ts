import { Atom, ViewController } from "@anxi/core";
import { DisplayObject } from "pixi.js";

export class ConstViewer<T extends DisplayObject> extends ViewController {
  onRender(): void {
    this.container.x = this.belonger!.x;
    this.container.y = this.belonger!.y;
  }
  insertAction(_action: unknown): never {
    throw new Error('The ConstViewer will never implement it');
  }
  removeAction(_index: number): never {
    throw new Error('The ConstViewer will never implement it');
  }
  constructor(atom: Atom, public view: T) {
    super(atom);
    this.container.addChild(view);
  }
}