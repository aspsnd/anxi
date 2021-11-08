import { a2r, Atom, World } from "@anxi/core";
import { ConstViewer } from "@anxi/view-const";
import { Texture } from "@pixi/core";
import { Container } from "@pixi/display";
import { TilingSprite } from "@pixi/sprite-tiling";
import { Matter, PhysicsController, PhysicsWorldController } from "@anxi/physics";
import { GameHeight, GameWidth } from "../config";
import "./canvas.scss";
import { Sprite } from "@pixi/sprite";
import { WorldViewController } from "@anxi/render/lib/view/WorldViewer";

export class SingleGame extends World {
  atomContainer = new Container()
  guiContainer = new Container()


  bg = new TilingSprite(Texture.from('/img/qianer/bg.webp'), GameWidth, GameHeight);
  constructor() {
    super();
    new ConstViewer(this, this.bg);
    new WorldViewController(this);
    const canvas = document.createElement('canvas');
    canvas.id = 'helper-canvas';
    document.body.append(canvas);
    const physics = new PhysicsWorldController(this, {
      gravity: {
        x: 0, y: 0, scale: 1
      },
      dev: {
        width: GameWidth,
        height: GameHeight
      },
      deltaConfig: {
        constDelta: 16
      },
      devCanvas: canvas
    });
    const wallbtoom = Matter.Bodies.rectangle(GameWidth >> 1, GameHeight + 25, GameWidth, 50, {
      isStatic: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 1
      }
    });
    Matter.Composite.add(physics.engine.world, wallbtoom);
    const walltop = Matter.Bodies.rectangle(GameWidth >> 1, -25, GameWidth, 50, {
      isStatic: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 1
      }
    });
    Matter.Composite.add(physics.engine.world, walltop);
    const wallleft = Matter.Bodies.rectangle(GameWidth + 25, GameHeight >> 1, 50, GameHeight, {
      isStatic: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 1
      }
    });
    Matter.Composite.add(physics.engine.world, wallleft);
    const wallright = Matter.Bodies.rectangle(-25, GameHeight >> 1, 50, GameHeight, {
      isStatic: true,
      collisionFilter: {
        group: -1,
        category: 2,
        mask: 1
      }
    });
    Matter.Composite.add(physics.engine.world, wallright);
  }
  init() {

  }
  onTime(timestamp: number) {
    super.onTime(timestamp);
    this.bg.tilePosition.y = timestamp/6;
    if (Math.random() < .016) {
      this.dropEnemy();
    }
  }

  dropEnemy() {
    const enemy = new Atom();
    enemy.x = Math.random() * GameWidth;
    enemy.y = 100;
    const viewer = new ConstViewer(enemy, new Sprite(Texture.from('/img/8.png')));
    viewer.view.anchor.set(.5, .5);

    const physics = new PhysicsController<true>(enemy, {
      isBody: true,
      body: Matter.Bodies.rectangle(enemy.x, enemy.y, 60, 130, {
        friction: 0,
        frictionAir: 0,
        collisionFilter: {
          group: 0,
          category: 8,
          mask: 5
        }
      }),
    }, controller => {
      enemy.x = controller.box.position.x;
      enemy.y = controller.box.position.y;
      viewer.view.rotation = controller.box.angle;
    });



    if (Math.random() > .5) {
      const random2 = Math.random();
      Matter.Body.setVelocity(physics.box, {
        x: 0,
        y: 6 * (1 + random2)
      })
      Matter.Body.setAngularVelocity(physics.box, a2r(5 + random2 * 10));
    } else {
      Matter.Body.setVelocity(physics.box, {
        x: 0,
        y: 6
      })
    }

    enemy.land(this);
    physics.on('collisionStart', e => {
      const enemyBox = e.data[0] as PhysicsController<true>;
      if (!enemyBox) return;
      const belonger = enemyBox.belonger;
      belonger!.destroy();
      enemy.destroy();
    });

    enemy.once('time_600', _ => {
      enemy.destroy();
    })
  }
}