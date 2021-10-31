import { Controller, World } from "@anxi/core";
import Matter from "matter-js";
import { AnxiEvent } from "../../../core/lib/event/event";
import { PhysicsControllerFlag } from "../atom";


export interface PhysicsWorldOptions extends Matter.IEngineDefinition {
  deltaConfig: {
    constDelta?: number,
    getter?: (delta: number) => number
  },
  devCanvas?: HTMLCanvasElement,
  dev?: {
    width?: number,
    height?: number
  }
}
export class PhysicsWorldController extends Controller {
  engine: Matter.Engine
  devtool: boolean = false
  render?: Matter.Render
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
    if (options.devCanvas) {
      this.devtool = true;
      this.render = Matter.Render.create({
        engine: this.engine,
        canvas: options.devCanvas,
        options: {
          width: options.dev?.width ?? 750,
          height: options.dev?.height ?? 1334,
        },
      });
      Matter.Render.run(this.render);
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
          bodyA[PhysicsControllerFlag]?.emit(new AnxiEvent(en, bodyB[PhysicsControllerFlag]));
          bodyB[PhysicsControllerFlag]?.emit(new AnxiEvent(en, bodyA[PhysicsControllerFlag]));
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