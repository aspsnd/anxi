import { SpineViewer } from "@anxi/view-spine";
import { Atom, AnxiLoader, StateController } from "@anxi/core";
import { Text, Sprite, Texture } from "pixi.js";
import { ActionData, MatrixViewer } from "@anxi/view-matrix";
import { App } from "@anxi/app";
import { RendererViewController } from "@anxi/render"

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
    app.world.get(RendererViewController).beforeContainer.addChild(text);
    text.interactive = true;
    text.on('tap', _ => {
      spineViewer.spine.state.setEmptyAnimations(0);
      spineViewer.spine.state.setAnimation(0, animationName, true);
    })
  }

  const stateController = window.state = new StateController(atom, {
    'idle': 0
  });
  stateController.setStateInfinite(0, true);

  const mView = new MatrixViewer(atom, new ActionData({
    0: {
      body: {
        frames: [0, 60, 90, 110, 150],
        length: 6,
        value: [
          [90, -75, 0],
          [90, -75, 360],
          [90, -75, 240, 1.2, 1.5],
          [90, -75, 420, 1.6, 2],
          [90, -75, 360],
        ]
      }
    }
  }));

  const body = new Sprite(Texture.from("/img/8.png"));
  body.anchor.set(.5, 0.2);
  mView.from({
    body
  });
}