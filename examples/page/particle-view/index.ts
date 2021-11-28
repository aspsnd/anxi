import { App } from "@anxi/app";
import { Atom } from "@anxi/core"
import { RendererViewController } from "@anxi/view";
import { ParticleViewer } from "@anxi/view-particle";
import type { InteractionEvent } from "@pixi/interaction";

export default async () => {
  let app = new App({
    view: appCanvas,
    width: 750,
    height: 1334,
    antialias: true,
  })

  const world = app.world;

  const atom = window.atom = new Atom({
    timeSpeed: 1,
    timeSlot: 0
  });

  atom.land(world);

  const config = await (await fetch('/emitter1.json')).json() as ConstructorParameters<typeof ParticleViewer>[1];

  const view = new ParticleViewer(atom, config);

  view.x = 750 >> 1;
  view.y = 1334 >> 1;

  world.get(RendererViewController).container.interactive = true;
  world.get(RendererViewController).container.on('pointermove', (e: InteractionEvent) => {
    view.x = e.data.global.x;
    view.y = e.data.global.y;
  })

}