import { Controller, World } from "@anxi/core";
import Matter from "matter-js";
import { AnxiEvent } from "../../../core/lib/event/event";
import { PhysicsControllerFlag } from "../atom";


export interface PhysicsWorldOptions extends Matter.IEngineDefinition {
  deltaConfig: {
    constDelta?: number,
    getter?: (delta: number) => number
  }
}
export class PhysicsWorldController extends Controller {
  engine: Matter.Engine
  constructor(world: World, readonly options: PhysicsWorldOptions) {
    super(world, true);
    this.engine = Matter.Engine.create(options);
    const { constDelta, getter } = options.deltaConfig;
    if (constDelta) {
      this.onTime = function () {
        Matter.Engine.update(this.engine, constDelta);
      }
    } else if (getter) {
      this.onTime = function (delta: number) {
        Matter.Engine.update(this.engine, getter(delta));
      }
    }
    this.init();
  }
  init() {
    super.init();
    this.initEvents();
  }
  initEvents() {
    const collisionEvents = ['collisionStart', 'collisionActive', 'collisionEnd'];
    for (const en of collisionEvents) {
      Matter.Events.on(this.engine, en, (e: Matter.IEventCollision<Matter.Engine>) => {
        const pairs = e.pairs;
        for (const pair of pairs) {
          const { bodyA, bodyB } = pair;
          bodyA[PhysicsControllerFlag].emit(new AnxiEvent(en, bodyB));
          bodyB[PhysicsControllerFlag].emit(new AnxiEvent(en, bodyA));
        };
      })
    }
  }
  onTime(delta: number) {
    Matter.Engine.update(this.engine, delta);
  }
  destroy() {
    Matter.Engine.clear(this.engine);
  }
}