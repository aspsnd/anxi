import { Atom, Controller, MoveStruct } from "@anxi/core";
import Matter, { Body } from "matter-js";
import { PhysicsControllerFlag } from "../symbol";
import { PhysicsWorldController } from "../world";

// export type Option = Matter.IBodyDefinition | Matter.ICompositeDefinition;
export type PhysicsControllerOptions<T extends boolean = boolean> = T extends true ? {
  readonly isBody: true,
  option?: Matter.IBodyDefinition,
  body?: Matter.Body
} : {
  readonly isBody: false,
  option?: Matter.ICompositeDefinition,
  composite?: Matter.Composite
};
export type PhysicsControllerEventNames = 'collisionStart' | 'collisionActive' | 'collisionEnd';
export class PhysicsController<T extends boolean> extends Controller<Atom, PhysicsControllerEventNames> {
  box: T extends true ? Matter.Body : Matter.Composite
  constructor(atom: Atom, readonly options: PhysicsControllerOptions<T>, public updateFunc?: (_: PhysicsController<T>) => void) {
    super(atom, true);
    if (options.isBody) {
      this.box = (options.body ?? Matter.Body.create(options.option ?? {})) as this['box'];
    } else {
      this.box = (options.composite ?? Matter.Composite.create(options.option)) as this['box'];
    }
    this.box[PhysicsControllerFlag] = this as this['box'][PhysicsControllerFlag];
    this.init();
  }
  init() {
    super.init();
    this.belonger!.on('getworld', () => {
      this.belonger && Matter.Composite.add(this.belonger.world!.get(PhysicsWorldController).engine.world!, this.box);
    });
    this.belonger!.on('loseworld', () => {
      this.belonger && Matter.Composite.remove(this.belonger.world!.get(PhysicsWorldController).engine.world!, this.box);
    });
    this.options.isBody && this.belonger!.on('movex', e => {
      const struct = e.data[0] as MoveStruct;
      Matter.Body.setPosition(this.box as Body, { x: struct.value, y: this.belonger!.y });
      struct.value = (this.box as Body).position.x;
    });
    this.options.isBody && this.belonger!.on('movey', e => {
      const struct = e.data[0] as MoveStruct;
      Matter.Body.setPosition(this.box as Body, { x: this.belonger!.x, y: struct.value });
      struct.value = (this.box as Body).position.y;
    });
  }
  destroy() {
    super.destroy();
    this.belonger && Matter.Composite.remove(this.belonger.world!.get(PhysicsWorldController).engine.world!, this.box);
  }
  onTime() {
    this.updateFunc?.(this);
  }
}