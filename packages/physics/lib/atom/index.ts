import { Atom, Controller } from "@anxi/core";
import Matter from "matter-js";
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
export const PhysicsControllerFlag: unique symbol = Symbol();
export type PhysicsControllerFlag = typeof PhysicsControllerFlag;
export type PhysicsControllerEventNames = 'collisionStart' | 'collisionActive' | 'collisionEnd';

export class PhysicsController<T extends boolean> extends Controller<Atom, PhysicsControllerEventNames> {
  box: T extends true ? Matter.Body : Matter.Composite
  constructor(atom: Atom, readonly options: PhysicsControllerOptions<T>, public updateFunc?: (_: PhysicsController<T>) => void) {
    super(atom);
    if (options.isBody) {
      this.box = (options.body ?? Matter.Body.create(options.option ?? {})) as this['box'];
    } else {
      this.box = (options.composite ?? Matter.Composite.create(options.option)) as this['box'];
    }
    this.box[PhysicsControllerFlag] = this as this['box'][PhysicsControllerFlag];
  }
  init() {
    super.init();
    this.belonger!.on('getworld', () => {
      this.belonger && Matter.Composite.add(this.belonger.world!.get(PhysicsWorldController).engine.world!, this.box);
    });
    this.belonger!.on('loseworld', () => {
      this.belonger && Matter.Composite.remove(this.belonger.world!.get(PhysicsWorldController).engine.world!, this.box);
    })
  }
  destroy() {
    super.destroy();
    this.belonger && Matter.Composite.remove(this.belonger.world!.get(PhysicsWorldController).engine.world!, this.box);
  }
  onTime() {
    this.updateFunc?.(this);
  }
}