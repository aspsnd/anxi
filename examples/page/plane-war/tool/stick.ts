import { Container, Rectangle, Graphics, Sprite, Texture, Circle, InteractionEvent } from "pixi.js";

export interface DirectorOptions {
  hitArea: Rectangle
  outerSize: number
  innerSize: number
  innerSprite?: Container | string
  outerSprite?: Container | string
  flow: boolean
  disappearWhenRelease: boolean
}

function getDefaultOptions(): DirectorOptions {
  return {
    hitArea: new Rectangle(0, 0, 750, 1443),
    outerSize: 150,
    innerSize: 70,
    flow: true,
    disappearWhenRelease: true
  }
}

export class Director extends Container {

  innerSprite: Container
  outerSprite: Container
  options: DirectorOptions
  flow: boolean
  disappearWhenRelease: boolean
  constructor(_options: Partial<DirectorOptions>) {
    super();
    document.addEventListener('keydown', e => {
      ['arrowdown', 's'].includes(e.key.toLowerCase()) && (this._offsetY = 1)
    })
    document.addEventListener('keyup', e => {
      ['arrowdown', 's'].includes(e.key.toLowerCase()) && this._offsetY == 1 && (this._offsetY = 0)
    })
    document.addEventListener('keydown', e => {
      ['arrowup', 'w'].includes(e.key.toLowerCase()) && (this._offsetY = -1)
    })
    document.addEventListener('keyup', e => {
      ['arrowup', 'w'].includes(e.key.toLowerCase()) && this._offsetY == -1 && (this._offsetY = 0)
    })
    document.addEventListener('keydown', e => {
      ['arrowright', 'd'].includes(e.key.toLowerCase()) && (this._offsetX = 1)
    })
    document.addEventListener('keyup', e => {
      ['arrowright', 'd'].includes(e.key.toLowerCase()) && this._offsetX == 1 && (this._offsetX = 0)
    })
    document.addEventListener('keydown', e => {
      ['arrowleft', 'a'].includes(e.key.toLowerCase()) && (this._offsetX = -1)
    })
    document.addEventListener('keyup', e => {
      ['arrowleft', 'a'].includes(e.key.toLowerCase()) && this._offsetX == -1 && (this._offsetX = 0)
    })
    const options = this.options = Object.assign(getDefaultOptions(), _options);
    this.hitArea = options.hitArea;
    const inner = this.innerSprite = this.generateSprite(options.innerSprite, this.options.innerSize);
    const outer = this.outerSprite = this.generateSprite(options.outerSprite, this.options.outerSize);
    this.flow = options.flow;
    this.disappearWhenRelease = options.disappearWhenRelease;
    outer.addChild(inner);
    this.addChild(outer);
    this.flow ? this.initWhenFlow() : this.initWhenNotFlow();
  }
  generateSprite(base: string | Container | undefined, size: number): Container {
    if (!base) {
      return new Graphics().lineStyle(3, 0x5599ff).drawCircle(0, 0, size);
    } else if (typeof base === 'string') {
      const sprite = new Sprite(Texture.from(base));
      sprite.width = sprite.height = size;
      sprite.anchor.set(.5);
      return sprite;
    } else {
      return base;
    }
  }
  set outerX(v: number) {
    this.outerSprite.x = v;
  }
  set outerY(v: number) {
    this.outerSprite.y = v;
  }
  set innerX(v: number) {
    this.innerSprite.x = v;
  }
  set innerY(v: number) {
    this.innerSprite.y = v;
  }
  get outerX() {
    return this.outerSprite.x;
  }
  get outerY() {
    return this.outerSprite.y;
  }
  get innerX() {
    return this.innerSprite.x;
  }
  get innerY() {
    return this.innerSprite.y;
  }
  private _offsetX = 0
  private _offsetY = 0
  get offsetX() {
    return this._offsetX;
  }
  get offsetY() {
    return this._offsetY;
  }
  initWhenFlow() {
    this.interactive = true;
    if (this.disappearWhenRelease) {
      this.outerSprite.visible = false;
      this.on('pointerdown', (e: InteractionEvent) => {
        this.outerSprite.visible = true;
        const { x, y } = e.data.getLocalPosition(this);
        this.outerSprite.x = x;
        this.outerSprite.y = y;
        this.updateTransform();
      })
      this.on('pointerup', () => {
        this.outerSprite.visible = false;
        this.handleMove(0, 0);
      })
      this.on('pointerupoutside', () => {
        this.outerSprite.visible = false;
        this.handleMove(0, 0);
      })
    } else {
      this.on('pointerdown', (e: InteractionEvent) => {
        const { x, y } = e.data.getLocalPosition(this);
        this.outerSprite.x = x;
        this.outerSprite.y = y;
        this.updateTransform();
      })
      this.on('pointerup', () => {
        this.handleMove(0, 0);
      })
      this.on('pointerupoutside', () => {
        this.handleMove(0, 0);
      })
    }

    this.on('pointermove', (e: InteractionEvent) => {
      const { x, y } = e.data.getLocalPosition(this.outerSprite);
      this.handleMove(x / this.options.outerSize, y / this.options.outerSize);
    })

  }
  initWhenNotFlow() {
    if (this.disappearWhenRelease) console.warn('when you set flow = false, then config disappearWhenRelease is not useful.')
    this.outerSprite.interactive = true;
    this.outerSprite.hitArea = new Circle(0, 0, this.options.outerSize);
    this.outerSprite.on('pointerdown', (e: InteractionEvent) => {
      const { x, y } = e.data.getLocalPosition(this.outerSprite);
      this.handleMove(x / this.options.outerSize, y / this.options.outerSize);
    })
    this.outerSprite.on('pointermove', (e: InteractionEvent) => {
      const { x, y } = e.data.getLocalPosition(this.outerSprite);
      this.handleMove(x / this.options.outerSize, y / this.options.outerSize);
    })
    this.outerSprite.on('pointerup', () => {
      this.handleMove(0, 0);
    })
    this.outerSprite.on('pointerupoutside', () => {
      this.handleMove(0, 0);
    })
  }
  handleMove(x: number, y: number) {
    const pow2 = x ** 2 + y ** 2;
    if (pow2 > 1) {
      const pow = 1 / (pow2 ** .5);
      x *= pow;
      y *= pow;
    }
    this._offsetX = x;
    this._offsetY = y;
    this.innerSprite.x = x * this.options.outerSize;
    this.innerSprite.y = y * this.options.outerSize;
  }
}