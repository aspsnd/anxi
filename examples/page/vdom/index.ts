import { ADocument, Div } from "@anxi/vdom";
import { Application } from "pixi.js";

export default (async () => {
  const app = new Application({
    view: appCanvas,
    width: 750,
    height: 1400
  });
  const document = new ADocument({
    app,
    style: {
      width: 750,
      height: 1400,
      backgroundColor: 0xefefef,
      backgroundSize: [2, 2],
      backgroundAlpha: .2
    }
  });
  document.link(app.stage);

  const div = new Div({
    width: 670,
    height: 1320,
    backgroundColor: [0, .95],
    x: 40,
    y: 40,
    borderWidth: 1,
    borderColor: 0x000000,
    backgroundImage: '/img/8.png',
    backgroundCover: true,
    backgroundAlpha: .5,
    borderRadius: 30,
  });
  document.appendChild(div);

  const text = new Div({
    x: 20,
    y: 600,
    content: 'Hello, Anxi!',
    textStyle: {
      fontSize: 120,
      fill: [0xff0000, 0x00ff00, 0x0000ff],
      strokeThickness: 1,
      stroke: 0xffffff,
      dropShadowAlpha: 1,
      dropShadow: true,
      dropShadowBlur: 20,
      dropShadowColor: 0,
      dropShadowDistance: 15
    }
  });
  div.appendChild(text);

})()