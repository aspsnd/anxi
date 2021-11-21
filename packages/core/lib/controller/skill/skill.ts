import { Quark } from "../../chain/Quark";
import type { AnxiListener, AnxiPlainListener, BEN } from "../../event/eventer";
import { AnxiEventer } from "../../event/eventer";
import type { SkillProto } from "./proto";

export class Skill<D extends Partial<{ [key: string]: any }> = {}, T extends {} = {}> extends AnxiEventer {

  name: string
  data!: D
  active: boolean
  cancel: SkillProto<T, D>['canceler']
  execute: SkillProto<T, D>['executer']
  extra: SkillProto<T, D>['extra']
  _initFunc: SkillProto<T, D>['_init']
  waitTime: SkillProto<T, D>['waitTime']
  waitUntil = -1
  inited = false
  listeners: AnxiPlainListener<BEN>[] = []
  removed = false

  constructor(public proto: SkillProto<T, D>) {
    super();
    this.active = proto._active;
    this.name = proto.name;
    this.cancel = proto.cancel;
    this.execute = proto.executer;
    this.extra = proto.extra;
    this._initFunc = proto._init;
    this.waitTime = proto.waitTime;
  }
  init() {
    this.inited = true;
    this.data = this.proto.datar.call(this);
    this.proto.initedListens.forEach(il => {
      let ecomt = this.quark.on(il.event, il.handler(this.quark, this), true);
      this.listeners.push(ecomt);
    });
    this._initFunc.call(this, this.data);
  }
  remove() {
    this.removed = true;
    for (const listener of this.listeners) {
      this.quark.removeListener(listener as AnxiListener<GlobalMixins.WholeQuarkEvents>);
    }
  }

  quark!: Quark
  link<K extends Quark>(quark: K) {
    this.quark = quark;
  }

}