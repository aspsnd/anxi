import { App, Atom, World } from "@anxi/core";
import { ADocument } from "@anxi/vdom";
import { ConstViewer } from "@anxi/view-const";
import { Graphics } from "pixi.js"
import { PhysicsController, PhysicsWorldController, Matter } from "@anxi/physics";
import { GameHeight, GameWidth } from "./src/global/config";
export default async () => {
  const app = new App({
    view: appCanvas,
    width: GameWidth,
    height: GameHeight
  });

  const document = new ADocument({
    app,
    style: {
      backgroundImage: '/img/qianer/bg.webp',
      backgroundRepeat: true
    }
  });
  const world = new World();

  app.eventer.on('onframe', e => {
    world.onFrame(e.data[1]);
  })

  document.customerView.addChild(world.container);

  const physicsWorld = new PhysicsWorldController(world, {
    deltaConfig: {
      constDelta: 20
    },
    gravity: {
      x: 0,
      y: 0,
      scale: 0
    },
    enableSleeping: false,
    velocityIterations: 10,
    positionIterations: 10
  });

  const bow = new Atom({});
  bow.x = GameWidth >> 1;
  bow.y = 300;
  new ConstViewer(bow, new Graphics().beginFill(0xff0000, .8).drawCircle(0, 0, 50).endFill());

  const bowBox = new PhysicsController<true>(bow, {
    isBody: true,
    body: Matter.Bodies.circle(bow.x, bow.y, 50, {
      collisionFilter: {
        group: -1
      },
      restitution: 1,
      density: 0.002,
      frictionAir: 0,
      friction: 0,
      frictionStatic: 0
    }),
  }, controller => {
    bow.x = controller.box.position.x;
    bow.y = controller.box.position.y;
  });

  const ground = new Atom({});
  new ConstViewer(ground, new Graphics().beginFill(0xff0000, 1).drawRect(-GameWidth / 2, -25, GameWidth, 50).endFill());

  ground.x = GameWidth / 2;
  ground.y = 100;
  new PhysicsController(ground, {
    isBody: true,
    body: Matter.Bodies.rectangle(ground.x, ground.y, GameWidth, 50, {
      isStatic: true,
      collisionFilter: {
        group: -2
      },
      friction: 0,
      density: 100000,
      frictionAir: 0,
      frictionStatic: 0
    }),
  });
  ground.land(world);

  const ground2 = new Atom({});
  ground2.x = GameWidth / 2;
  ground2.y = GameHeight - 100;
  new ConstViewer(ground2, new Graphics().beginFill(0xff0000, 1).drawRect(-GameWidth / 2, -25, GameWidth, 50).endFill());
  new PhysicsController(ground2, {
    isBody: true,
    body: Matter.Bodies.rectangle(ground2.x, ground2.y, GameWidth, 50, {
      isStatic: true,
      collisionFilter: {
        group: -2
      },
      friction: 0,
      density: 100000,
      frictionAir: 0,
      frictionStatic: 0
    }),
  });
  ground2.land(world);

  bow.land(world);

  document.link(app.stage);

  Matter.Body.setVelocity(bowBox.box, {
    x: 0,
    y: 20
  });
  // Matter.Body.setAngularVelocity(bowBox.box, 1);

  bowBox.on('collisionStart', _ => {
    console.log('collisionStart,speed: ', bowBox.box.speed);
  })
  bowBox.on('collisionEnd', _ => {
    console.log('collisionEnd,speed: ', bowBox.box.speed);
  })

  //@ts-ignore
  window.body = bowBox.box;
  //@ts-ignore
  window.world = physicsWorld;

}