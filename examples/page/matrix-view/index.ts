import { App } from "@anxi/app";
import { Atom, StateController } from "@anxi/core"
import { ActionData, MatrixViewer } from "@anxi/view-matrix";
import { Matrix, Sprite, Texture } from "pixi.js";

export default async () => {
  let app = new App({
    view: appCanvas,
    width: 750,
    height: 1334,
    antialias: true
  })
  const { world } = app;

  for (let i = 0; i < 9; i++) {
    const atom = window.atom = new Atom({
      timeSpeed: 1,
      timeSlot: 0
    });

    atom.land(world);
    atom.x = 200 * (i % 3) + 200;
    atom.y = 400 * ~~(i / 3) + 200;

    const stateController = window.state = new StateController(atom, {
      'idle': 0
    });
    stateController.setStateInfinite(0, true);

    window.Matrix = Matrix;
    const mView = new MatrixViewer(atom, new ActionData({
      0: {
        body: {
          frames: [0, 60, 90, 110, 150],
          length: 6,
          value: [
            [0, 0, 0],
            [0, 0, 360],
            [0, 0, 240, 1.2, 1.5],
            [0, 0, 420, 1.6, 2],
            [0, 0, 360],
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

}