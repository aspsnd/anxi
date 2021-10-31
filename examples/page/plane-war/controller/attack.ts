import { Controller } from "@anxi/core";

export class AttackController extends Controller {
  onTime() {
    if (this.belonger!.time % 60 === 0) {
      console.log('attack');
    }
  }
}