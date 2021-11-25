import { Controller } from "@anxi/core";
import type { World } from "@anxi/core";
import { Container } from "@pixi/display";

export class WorldViewController extends Controller<World> {
  container = new Container()
  beforeContainer = new Container()
  childContainer = new Container()
  afterContainer = new Container()
  constructor(world: World) {
    super(world);
    this.container.addChild(this.beforeContainer, this.childContainer, this.afterContainer);
  }

}