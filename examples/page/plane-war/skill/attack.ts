import { Atom, SkillProto } from "@anxi/core";
import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { Matter, PhysicsController } from "@anxi/physics";
import { ConstViewer } from "@anxi/view-const";

export const attackProto = new SkillProto('普通攻击').init(function () {
  this.quark.on('time', _ => {
    if (this.quark.time % 20 > 0) return;
    const arrow = new Atom();
    const viewer = new ConstViewer(arrow, new Sprite(Texture.from('/img/qianer/arrow.png')));
    viewer.view.anchor.set(.6, .55);
    arrow.x = this.quark.x;
    arrow.y = this.quark.y;
    const box = new PhysicsController<true>(arrow, {
      isBody: true,
      body: Matter.Bodies.rectangle(arrow.x, arrow.y, 30, 140, {
        collisionFilter: {
          group: -2,
          category: 4,
          mask: 8
        },
        frictionAir: 0,
        friction: 0,
      })
    }, controller => {
      arrow.x = controller.box.position.x;
      arrow.y = controller.box.position.y;
    });
    arrow.on('time_180', _ => {
      arrow.destroy();
    })
    arrow.land(this.quark.world!);
    Matter.Body.setVelocity(box.box, { x: 0, y: -10 });
    box.on('collisionStart', e => {
      const enemyBox = e.data[0] as PhysicsController<true>;
      if (!enemyBox) return;
      enemyBox.belonger?.destroy();
      arrow.destroy();
    })
  })
})