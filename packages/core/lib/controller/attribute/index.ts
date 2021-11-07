import { Attribute } from "./attribute";
import { Atom } from "../../chain/Atom";
import { Controller } from "../controller";

export class AttributeController<S extends string = string> extends Controller {
  attrs: { [key in S]?: Attribute<S> } = {}
  attrArray: Attribute<S>[] = []
  needCompute = false
  relyChain: { [key in S]?: Attribute<S>[] } = {}
  constructor(atom: Atom, block: Record<S, number>) {
    super(atom);
    this.from(block);
    this.compute();
  }
  from(block: Record<S, number>) {
    for (const [p, v] of Object.entries(block) as [S, number][]) {
      const attr = this.attrs[p] = new Attribute(p, this);
      this.attrArray.push(attr);
      attr.addCommonCaculator(() => {
        attr.base += v;
      });
    }
  }
  get(attr: S) {
    return this.attrs[attr]?.value ?? 0;
  }
  getAttr<K extends S>(attr: K) {
    return this.attrs[attr]! as Attribute<K>;
  }
  init() {
    super.init();
  }
  compute() {
    let needComputeAttr = new Set(this.attrArray);
    while (needComputeAttr.size > 0) {
      let nextNeedComputeAttr = new Set<Attribute<S>>();
      for (const attr of needComputeAttr) {
        const changed = attr.caculate();
        if (changed) {
          for (const a of this.relyChain[attr.name] ?? []) {
            nextNeedComputeAttr.add(a);
          }
        }
      }
      needComputeAttr = nextNeedComputeAttr;
    }

    for (const attr of this.attrArray) {
      attr.caculateAnnoy();
    }

    this.needCompute = false;

  }
  computeAbsolutely() {
    for (const attr of this.attrArray) {
      attr.caculate();
    }
    this.needCompute = false;
  }
}