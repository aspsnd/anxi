import { Quark } from "@anxi/core";
import { ViewController } from "@anxi/view";
import { DisplayObject } from "@anxi/render";

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
  constructor(quark: Quark, public view: T) {
    super(quark);
    this.container.addChild(view);
  }
}