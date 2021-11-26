import { Container, Graphics, Sprite, Text, Texture, TilingSprite } from "@anxi/render";
import { AStyle } from "../pcss/style";
import { AElement } from "./element";

export abstract class ABaseElement implements AElement {
  children: AElement[] = []
  view = new Container()
  selfView = new Container()
  customerView = new Container()
  childrenView = new Container()
  style: AStyle = new AStyle(this)
  needPaint = false
  parent?: AElement
  constructor(style?: Partial<AStyle>) {
    this.view.addChild(this.selfView);
    this.view.addChild(this.customerView);
    this.view.addChild(this.childrenView);
    style && this.style.assign(style);
  }

  repaint() {
    this.needPaint = false;
    this.selfView.removeChildren();
    if (this.style.backgroundGradient !== undefined) {
      console.log('gradient');
    } else if (this.style.backgroundColor !== undefined) {
      const [color, alpha] = this.style.backgroundColor as [number, number];
      const graphics = new Graphics();
      graphics.beginFill(color, alpha).drawRoundedRect(0, 0, this.style.width, this.style.height, this.style.borderRadius).endFill();
      this.selfView.addChild(graphics);
    }
    if (this.style.backgroundImage !== undefined) {
      if (this.style.backgroundRepeat) {
        let sprite = new TilingSprite(Texture.from(this.style.backgroundImage), this.style.width, this.style.height);
        sprite.tileScale.set(...this.style.backgroundSize);
        sprite.tileTransform.position.set(...this.style.backgroundOffset);
        sprite.alpha = this.style.backgroundAlpha;
        if (this.style.borderRadius > 0) {
          const { x, y } = this.selfView.getGlobalPosition();
          sprite.mask = new Graphics().beginFill(0, 1).drawRoundedRect(x, y, this.style.width, this.style.height, this.style.borderRadius).endFill();
        }
        this.selfView.addChild(sprite);
      } else {
        let sprite = new Sprite(Texture.from(this.style.backgroundImage));
        sprite.texture.baseTexture.on('loaded', () => {
          console.log(sprite.width, sprite.height);
          if (this.style.backgroundContain || this.style.backgroundCover) {
            if ((sprite.width * this.style.height > sprite.height * this.style.width) !== this.style.backgroundCover) {
              let scale = this.style.width / sprite.width;
              sprite.width *= scale;
              sprite.height *= scale;
            } else {
              let scale = this.style.height / sprite.height;
              sprite.scale.set(scale, scale);
            }
          }

        })
        sprite.alpha = this.style.backgroundAlpha;
        if (this.style.borderRadius > 0) {
          const { x, y } = this.selfView.getGlobalPosition();
          const g = new Graphics().lineStyle(0).beginFill(0, 1).drawRoundedRect(x, y, this.style.width, this.style.height, this.style.borderRadius).endFill();
          sprite.mask = g;
        }
        this.selfView.addChild(sprite);
      }
    }
    if (this.style.borderWidth > 0 && (this.style.borderColor as [number, number])[1] > 0) {
      const graphics = new Graphics();
      graphics.lineStyle({
        width: this.style.borderWidth,
        color: (this.style.borderColor as [number, number])[0],
        alpha: (this.style.borderColor as [number, number])[1],
        alignment: 0
      }).drawRoundedRect(0, 0, this.style.width, this.style.height, this.style.borderRadius);
      this.selfView.addChild(graphics);
    }
    if (this.style.content.length > 0) {
      let text = new Text(this.style.content, this.style.textStyle);
      this.selfView.addChild(text);
    }
  }
  appendChild(child: AElement) {
    child.parent?.removeChild(child);
    child.parent = this;
    this.children.push(child);
    this.childrenView.addChild(child.view);
  }
  removeChild(child: AElement) {
    child.parent = undefined;
    this.childrenView.removeChild(child.view);
    this.children.splice(this.children.indexOf(child), 1);
  }
  removeChildren() {
    for (const child of this.children) {
      child.parent = undefined;
    }
    this.children.splice(0, this.children.length);
    this.childrenView.removeChildren();
  }
  remove() {
    this.parent?.removeChild(this);
  }
  update() {
    if (this.needPaint) {
      this.repaint();
    }
    for (const child of this.children) {
      child.update();
    }
  }
}