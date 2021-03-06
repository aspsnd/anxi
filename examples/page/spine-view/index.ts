import { SpineViewer } from "@anxi/view-spine";
import { App, World, Atom, AnxiLoader } from "@anxi/core";
import { Text } from "pixi.js";
export default async function () {
  let app = new App({
    view: appCanvas,
    width: 750,
    height: 1334,
    antialias: true,
  })
  app.start();

  const world = new World().bind(app, app.stage);

  const atom = window.atom = new Atom({
    timeSpeed: 1,
    timeSlot: 0
  });

  atom.land(world);
  atom.x = 200;
  atom.y = 500;


  const asyncLoader = new AnxiLoader(app.loader);
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
    app.stage.addChild(text);
    text.interactive = true;
    text.on('tap', _ => {
      spineViewer.spine.state.setEmptyAnimations(0);
      spineViewer.spine.state.setAnimation(0, animationName, true);
    })
  }
  // spineViewer.spine.state.
}