import { App, Atom, World } from "@anxi/core"
import { ParticleViewer } from "@anxi/view-particle";
import type { InteractionEvent } from "@pixi/interaction";

export default async () => {
  let app = new App({
    view: appCanvas,
    width: 750,
    height: 1334,
    antialias: true,
    sharedLoader: true
  })
  __DEV__(app);
  app.start();

  const world = new World();
  app.ticker.add((delta) => world.onFrame(delta));
  app.stage.addChild(world.container);

  const atom = window.atom = new Atom({
    timeSpeed: 1,
    timeSlot: 0
  });

  atom.land(world);

  const config = await (await fetch('/emitter1.json')).json() as ConstructorParameters<typeof ParticleViewer>[1];

  const view = new ParticleViewer(atom, config);

  view.x = 750 >> 1;
  view.y = 1334 >> 1;

  app.stage.interactive = true;
  app.stage.on('pointermove', (e: InteractionEvent) => {
    view.x = e.data.global.x;
    view.y = e.data.global.y;
  })

}