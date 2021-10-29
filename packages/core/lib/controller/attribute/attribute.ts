import type { AttributeController } from "./"
import { AnxiEvent } from "../../event/event"

export interface AttributeCaculator {
  (controller: AttributeController, attr: Attribute): void
}

export class Attribute<A extends string = string> {

  //计算出的基础属性值
  base = 0
  //计算出的额外属性值
  extra = 0
  //计算出的属性倍率
  baseRate = 1
  extraRate = 1

  //最终基础属性值
  finalBase = 0
  //最终额外属性值
  finalExtra = 0
  //最终属性值
  value = 0

  /**
   * 建议以此更改base,extra,baseRate,extraRate
  */
  commonCaculators: AttributeCaculator[] = []
  /**
   * 直接更改finalBase、finalExtra
   * 实现避免属性的循环依赖，如技能:【增加血量5%的攻击力，增加攻击力200%的血量】
   * 该计算发生在最后，任意的计算结果都不会抛出属性值改变的事件
   */
  annoyCaculators: AttributeCaculator[] = []
  constructor(public name: A, public controller: AttributeController) { }
  //对属性值进行计算
  caculate() {
    const oldValue = this.value;

    this.base = this.extra = this.finalBase = this.finalExtra = this.value = 0;
    this.baseRate = this.extraRate = 1;

    for (const caculator of this.commonCaculators) {
      caculator(this.controller, this);
    }

    this.finalBase = this.base * this.baseRate;
    this.finalExtra = this.extra * this.extraRate;
    this.value = this.finalBase + this.finalExtra;

    if (this.value !== oldValue) {
      this.controller.emit(new AnxiEvent(`${this.name}change`, [oldValue, this.value]));
      return true;
    }
    return false;

  }

  caculateAnnoy() {
    for (const caculator of this.annoyCaculators) {
      caculator(this.controller, this);
    }

    this.value = this.finalBase + this.finalExtra;
  }

  rely(...attrs: A[]) {
    for (const attr of attrs) {
      if (!this.controller.relyChain[attr]) {
        this.controller.relyChain[attr] = [];
      }
      this.controller.relyChain[attr]!.push(this);
    }
  }
  removeRely(...attrs: A[]) {
    for (const attr of attrs) {
      let attrs = this.controller.relyChain[attr];
      if (!attrs) {
        attrs = this.controller.relyChain[attr] = [];
      }
      attrs.splice(attrs.indexOf(this), 1);
    }
  }
  /**
   * 建议以此更改base,extra,baseRate,extraRate
  */
  addCommonCaculator(func: AttributeCaculator) {
    this.commonCaculators.push(func);
  }
  /**
   * 直接更改finalBase、finalExtra
   * 实现避免属性的循环依赖，如技能:【增加血量5%的攻击力，增加攻击力200%的血量】
   * 该计算发生在最后，任意的计算结果都不会抛出属性值改变的事件
   */
  addAnnoyCaculator(func: AttributeCaculator) {
    this.annoyCaculators.push(func);
  }
  removeCaculator(func: AttributeCaculator, annoy: boolean) {
    const caculators = annoy ? this.annoyCaculators : this.commonCaculators;
    caculators.splice(caculators.indexOf(func), 1);
  }
}