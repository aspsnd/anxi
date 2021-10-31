import { Atom, Skill, SkillController } from "@anxi/core";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { PhysicsController, Matter } from "@anxi/physics";
import { ConstViewer } from "@anxi/view-const";
import { attackProto } from "../skill/attack";


export const defaultProp = {
  hp: 100,
  atk: 10,
  as: 60
}

export class Plane extends Atom {
  box: Matter.Body
  constructor() {
    super(defaultProp);
    const sprite = new Sprite(Texture.from('/img/qianer/ple.png'))
    sprite.scale.set(.5);
    sprite.anchor.set(.4, .5);
    new ConstViewer(this, sprite);
    Matter.Common.random
    const physics = new PhysicsController<true>(this, {
      isBody: true,
      body: Matter.Bodies.circle(this.x, this.y, 40, {
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        collisionFilter: {
          group: -2,
          category: 1,
          mask: 10
        }
      }),
    }, controller => {
      this._x = controller.box.position.x;
      this._y = controller.box.position.y;
    });
    this.box = physics.box;

    const skillController = new SkillController(this);
    const attackSKill = new Skill(attackProto);
    skillController.add(attackSKill);

    this.once('destroy', _ => {
      alert('你被击中了');
      location.reload();
    })
  }
}