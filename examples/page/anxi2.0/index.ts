import { App } from "@anxi/app";
import { StateController } from "@anxi/core"
import { Quark } from "@anxi/core/lib/chain/Quark";
import { Sprite, Texture } from "@anxi/render";
import { ActionData, MatrixViewer } from "@anxi/view-matrix";

export default async () => {
  const app = new App({
    view: appCanvas,
    width: 750,
    height: 1334,
    backgroundColor: 0,
    backgroundAlpha: 1,
    logicalFPS: 60,
    renderFPS: 60
  });
  const { world } = app;
  const quark = new Quark();

  quark.land(world);
  quark.x = 750 >> 1;
  quark.y = 1334 >> 1;

  const stateController = window.state = new StateController(quark, {
    'idle': 0
  });
  stateController.setStateInfinite(0, true);

  const mView = new MatrixViewer(quark, new ActionData({
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