import { SpineViewer } from "@anxi/view-spine";
import {  World, Atom, AnxiLoader } from "@anxi/core";
import { Text } from "pixi.js";
import { App } from "@anxi/app";
import { RendererViewController } from "@anxi/render";
export default async function () {
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
  atom.x = 200;
  atom.y = 500;


  const asyncLoader = new AnxiLoader();
  const resource = await asyncLoader.get('cat', '/img/spine/cat/0.json');
  // console.log(res);
  const spineViewer = new SpineViewer(atom, resource);
  spineViewer.spine.scale.set(.4, .4);

  let index = 0;
  for (const animationName of spineViewer.animateNames) {
    const text = new Text(animationName, {
      fill: '0xff0000',
      fontSize: 50
    });
    text.x = 600;
    text.y = index++ * 60 + 100;
    world.get(RendererViewController).beforeContainer.addChild(text);
    text.interactive = true;
    text.on('tap', _ => {
      spineViewer.spine.state.setEmptyAnimations(0);
      spineViewer.spine.state.setAnimation(0, animationName, true);
    })
  }
  // spineViewer.spine.state.
}