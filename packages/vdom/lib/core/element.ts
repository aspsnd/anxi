import { Container } from "@anxi/render";
import { AStyle } from "../pcss/style";

export interface AElement {
  children: AElement[]
  parent?: AElement
  view: Container
  style: AStyle
  repaint(): void
  needPaint: boolean
  appendChild(child: AElement): void
  removeChild(child: AElement): void
  removeChildren(): void
  remove(): void
  update():void
}