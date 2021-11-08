import { Application, Container } from "pixi.js";
import { ABaseElement } from "../core";
import { AStyle } from "../pcss/style";


export interface ADocumentOptions<T extends Application = Application> {
  app: T,
  style?: Partial<AStyle>
}
export class ADocument<T extends Application> extends ABaseElement {
  app: T
  constructor(public options: ADocumentOptions<T>) {
    super(options.style);
    this.app = options.app;
    this.app.ticker.add(this.updateSeed);
  }
  link(root: Container) {
    root.addChild(this.view);
  }
  updateSeed = this.update.bind(this)
}