import { Quark } from './Quark';

export class World extends Quark {
  time = 0
  parentTime = 0
  isWorld = true
  constructor(base?: ConstructorParameters<typeof Quark>[0]) {
    super(base);
  }
  bind() {
    
  }
  destroy() {
    super.destroy();
  }
}