import { AnxiEventer } from "../../event/eventer";
import { StateItem } from "./item";

export class State extends AnxiEventer {
  private _left = 0
  get left() {
    return this._left;
  }
  set left(v: number) {
    if (this.composite) throw new Error('can not ser left for a composite state object!');
    let oldState = this._left > 0 || this.infinite;
    this._left = Math.max(v, 0);
    if (oldState !== (this._left > 0 || this.infinite)) {
      this.on(oldState ? 'lost' : 'get');
    }
  }
  time = 0
  lastGet = -1
  lastLost = -1
  headTime = 0
  private _infinite = false
  set infinite(v: boolean) {
    let oldState = this._left > 0 || this.infinite;
    this._infinite = v;
    if (oldState !== (this._left > 0 || this.infinite)) {
      this.on(oldState ? 'lost' : 'get');
    }
  }
  get infinite() {
    return this._infinite;
  }


  exist() {
    return this.infinite || this.left > 0;
  }
  constructor(public index: number, public composite: boolean = false) {
    super();
  }

  items: StateItem[] = []
  onTime() {
    if (!this.exist()) return;
    this.time++;
    this.left--;
    if (this.composite) {
      this.items = this.items.filter(item => !item.destroyed);
      for (const item of this.items) {
        if (item.left) item.left--;
        item.time++;
        item.left > 0 || item.infinite || item.destroy();
      }
    }
  }
  insert(item: StateItem) {
    if (!this.composite) throw new Error('not complex state!');
    this.items.push(item);
    this.left = Math.max(this.left, item.left);
    if (item.infinite) {
      this.infinite = true;
    }
    return;
  }
  remove(item: StateItem) {
    if (!this.composite) throw new Error('not complex state!');
    let index = this.items.indexOf(item);
    if (index < 0) return;
    if (this.left === item.left) {
      this.left = Math.max(...this.items.map(item => item.left));
    }
    if (item.infinite) {
      this.infinite = this.items.some(item => item.infinite);
    }
    item.destroy();
  }
  clear() {
    this._left = 0;
    this.infinite = false;
    this.items.forEach(item => item.destroy());
    this.items = [];
  }
}