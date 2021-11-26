import { ViewController } from "@anxi/view";
import { Quark, StateController } from "@anxi/core";
import { Spine } from "pixi-spine";
import { LoaderResource } from "@anxi/render";

export class SpineViewer extends ViewController {

  spine: Spine

  animateNames: string[]

  constructor(quark: Quark, public resource: LoaderResource) {
    super(quark);
    const data = resource.spineData;
    if (!data) throw new Error('the resource is not a valid spine resource');
    this.spine = new Spine(data);
    this.animateNames = data.animations.map(({ name }) => name);
    this.container.addChild(this.spine);
  }
  init() {
    super.init();
    this.eventer.on('headstatechange', e => {
      if (!this.useStateController) return;
      const [oldIndex, newIndex] = e.data as [number, number];
      this.spine.state.setEmptyAnimation(oldIndex, 0);
      this.spine.state.setAnimation(newIndex, this.getAnimationNameSavely(newIndex), true);
    });
  }
  onRender() {
    this.container.x = this.belonger!.x;
    this.container.y = this.belonger!.y;
  }
  animationMap: Record<number, string> = {}
  getAnimationName(priority: number) {
    if (this.animationMap[priority]) return this.animationMap[priority];
    if (this.useStateController) {
      const animateName = StateController.stateNameMap[priority] ?? this.belonger!.get(StateController)?.stateNameMap[priority];
      if (animateName && this.animateNames.includes(animateName)) {
        this.animationMap[priority] = animateName;
        return animateName;
      }
    }
    return undefined;
  }
  getAnimationNameSavely(priority: number) {
    return this.getAnimationName(priority) ?? this.animateNames[0];
  }
  useStateController = false
  linkState(table: Record<number, string> = {}) {
    this.useStateController = true;
    Object.assign(this.animationMap, table);
    const headIndex = this.belonger?.get(StateController)?.headState?.index;
    typeof headIndex === 'number' && this.spine.state.setAnimation(headIndex, this.getAnimationNameSavely(headIndex), true);
  }
  insertAction() {
    console.warn('SpineController has not implemented this method now!');
    return 0;
  }
  removeAction(_index: number) {
    console.warn('SpineController has not implemented this method now!');
  }
}