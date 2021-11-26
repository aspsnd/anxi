import { ITextStyle } from "@anxi/render";
import { AElement } from "../core/element";

export class AStyle {
  element: AElement
  constructor(element: AElement) {
    this.element = element;
  }

  assign(obj: Partial<AStyle>) {
    Object.assign(this, obj);
  }

  _sort: boolean = false
  set sort(v: boolean) {
    this._sort = v;
    this.element.view.sortableChildren = v;
  }
  get sort() {
    return this._sort;
  }

  _width: number = 0
  set width(v: number) {
    this._width = v;
    this.element.view.width = v;
  }
  get width() {
    return this._width;
  }

  _height: number = 0
  set height(v: number) {
    this._height = v;
    this.element.view.height = v;
  }
  get height() {
    return this._height;
  }

  _x: number = 0
  set x(v: number) {
    this._x = v;
    this.element.view.x = v;
  }
  get x() {
    return this._x;
  }

  _y: number = 0
  set y(v: number) {
    this._y = v;
    this.element.view.y = v;
  }
  get y() {
    return this._y;
  }

  _pointerEvents = true
  set pointerEvents(v: boolean) {
    this._pointerEvents = v;
    this.element.view.interactive = v;
  }
  get pointerEvents() {
    return this._pointerEvents;
  }

  _backgroundRepeat = false
  set backgroundRepeat(v: boolean) {
    this._backgroundRepeat = v;
    this.element.needPaint = true;
  }
  get backgroundRepeat() {
    return this._backgroundRepeat;
  }

  _backgroundContain = false
  set backgroundContain(v: boolean) {
    this._backgroundContain = v;
    this.element.needPaint = true;
  }
  get backgroundContain() {
    return this._backgroundContain;
  }

  _backgroundCover = false
  set backgroundCover(v: boolean) {
    this._backgroundCover = v;
    this.element.needPaint = true;
  }
  get backgroundCover() {
    return this._backgroundCover;
  }

  _backgroundOffset: [number, number] = [0, 0]
  set backgroundOffset(v: [number, number]) {
    this._backgroundOffset = v;
    this.element.needPaint = true;
  }
  get backgroundOffset() {
    return this._backgroundOffset;
  }

  _backgroundImage?: string
  set backgroundImage(v: string) {
    this._backgroundImage = v;
    this.element.needPaint = true;
  }
  get backgroundImage() {
    return this._backgroundImage!;
  }

  _backgroundColor?: [number, number]
  set backgroundColor(v: [number, number] | number) {
    this._backgroundColor = typeof v === 'number' ? [v, 1] : v;
    this.element.needPaint = true;
  }
  get backgroundColor(): [number, number] | number {
    return this._backgroundColor!;
  }

  _backgroundSize: [number, number] = [1, 1]
  set backgroundSize(v: [number, number]) {
    this._backgroundSize = v;
    this.element.needPaint = true;
  }
  get backgroundSize(): [number, number] {
    return this._backgroundSize;
  }

  _backgroundGradientColor?: number[]
  set backgroundGradientColor(v: number[]) {
    this._backgroundGradientColor = v;
    this.element.needPaint = true;
  }
  get backgroundGradientColor() {
    return this._backgroundGradientColor!;
  }

  _backgroundGradient?: number
  set backgroundGradient(v: number) {
    this._backgroundGradient = v;
    this.element.needPaint = true;
  }
  get backgroundGradient(): number {
    return this._backgroundGradient!;
  }

  _fontSize = 12
  set fontSize(v: number) {
    this._fontSize = v;
  }
  get fontSize() {
    return this._fontSize;
  }

  _borderWidth = 0
  set borderWidth(v: number) {
    this._borderWidth = v;
    this.element.needPaint = true;
  }
  get borderWidth() {
    return this._borderWidth;
  }

  _borderColor: [number, number] = [0, 0]
  set borderColor(v: [number, number] | number) {
    this._borderColor = typeof v === 'number' ? [v, 1] : v;
    this.element.needPaint = true;
  }
  get borderColor(): [number, number] | number {
    return this._borderColor;
  }

  _borderRadius: number = 0
  set borderRadius(v: number) {
    this._borderRadius = v;
    this.element.needPaint = true;
  }
  get borderRadius(): number {
    return this._borderRadius;
  }

  _backgroundAlpha: number = 1
  set backgroundAlpha(v: number) {
    this._backgroundAlpha = v;
    this.element.needPaint = true;
  }
  get backgroundAlpha(): number {
    return this._backgroundAlpha;
  }

  _content: string = ''
  set content(v: string) {
    this._content = v;
    this.element.needPaint = true;
  }
  get content() {
    return this._content;
  }

  textStyle: Partial<ITextStyle> = {}


}