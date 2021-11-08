import { App } from "@anxi/app";
import { Matter } from "@anxi/physics";
import { RendererViewController } from "@anxi/render";
import { GameHeight, GameWidth } from "./config";
import { SingleGame } from "./game";
import { Plane } from "./game/plane";
import { Director } from "./tool/stick";

export default async function () {
  const app = new App({
    view: appCanvas,
    width: GameWidth,
    height: GameHeight,
  });

  const game = window.game = new SingleGame();
  game.land(app.world);
  game.init();


  const player = new Plane();
  player.land(game);
  player.x = GameWidth >> 1;
  player.y = GameHeight - 100;


  const director = new Director({});
  director.outerX = GameWidth >> 1;
  director.outerY = GameHeight - 300;
  app.world.get(RendererViewController).afterContainer.addChild(director);

  player.on('time', () => {
    Matter.Body.setVelocity(player.box, {
      x: director.offsetX * 15,
      y: director.offsetY * 15,
    })
  })

}