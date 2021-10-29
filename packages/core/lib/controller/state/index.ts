import { State } from "./state";
import { Controller } from "../controller";
import { Atom } from "../../chain/atom";
import { AnxiEvent } from "../../event/event";
import { StateItem } from "./item";

export type StateIndex = number;

export type StateControllerOptions = {
  [key in string]: number | {
    priority: number,
    composite?: boolean
  }
}
export type StateMap = {
  [priority: number]: boolean
}
export class StateController extends Controller {
  static stateMap: StateMap = {}
  static useStateMap(map: StateControllerOptions) {
    for (const [name, v] of Object.entries(map)) {
      if (typeof v === 'number') {
        this.stateNameMap[v] = name;
        this.stateMap[v] = false;
      } else {
        this.stateNameMap[v.priority] = name;
        this.stateMap[v.priority] = !!v.composite;
      }
    }
  }
  static stateNameMap: Record<number, string> = {}
  stateNameMap: Record<number, string> = {}
  private stateMap: Map<number, State> = new Map()
  private states: State[] = []
  get(index: StateIndex) {
    return this.stateMap.get(index);
  }
  getExistState(index: StateIndex) {
    return this.stateMap.has(index) ? this.stateMap.get(index)! : this.registerState(index, !!StateController.stateMap[index]);
  }
  constructor(atom: Atom, public block: StateControllerOptions) {
    super(atom, true);
    this.init();
  }
  init() {
    super.init();
    const block = this.block;
    for (const [name, v] of Object.entries(block)) {
      if (typeof v === 'number') {
        this.stateNameMap[v] = name;
        this.registerState(v);
      } else {
        this.stateNameMap[v.priority] = name;
        this.registerState(v.priority, v.composite);
      }
    }
  }
  private registerState(priority: number, composite: boolean = false) {
    if (this.stateMap.has(priority)) throw new Error(`State ${priority} has been registered!`);
    const state = new State(priority, composite);
    state.on('lost', () => {
      state.lastLost = this.belonger!.time;
      state.time = 0;
      if (this.headState.index == priority) {
        this.headState = this.getExistStates().reduce((a, b) => b.index > a.index ? b : a);
      }
      this.belonger!.on(new AnxiEvent('losestate', priority));
      this.belonger!.on(`losestate_${priority}`);
    }, true);
    state.on('get', () => {
      state.lastGet = this.belonger!.time;
      if (this._headIndex < priority) {
        this.headState = state;
      }
      this.belonger!.on(new AnxiEvent('getstate', priority));
      this.belonger!.on(`getstate_${priority}`);
    }, true);
    this.stateMap.set(priority, state);
    this.states.push(state);
    return state;
  }

  private _headIndex: number = 0
  get headState(): State {
    return this.stateMap.get(this._headIndex)!;
  }

  set headState(state: State) {
    if (!state.exist()) throw new Error('The head state must exist!');
    const oldIndex = this._headIndex;
    this._headIndex = state.index;
    this.belonger!.emit(new AnxiEvent('headstatechange', [oldIndex, this._headIndex]));
  }

  getExistStates() {
    return this.states.filter(state => state.exist());
  }

  public some(...priorities: StateIndex[]) {
    return priorities.some(priority => this.stateMap.get(priority)?.exist());
  }

  public every(...priorities: StateIndex[]) {
    return priorities.every(priority => this.stateMap.get(priority)?.exist());
  }

  public removeState(...priorities: StateIndex[]) {
    for (const index of priorities) {
      const state = this.stateMap.get(index);
      if (!state?.exist()) continue;
      state.clear();
      this.belonger!.on(new AnxiEvent(`losestate`, index));
      this.belonger!.on(new AnxiEvent(`losestate_${index}`));
    }
  }

  public setStateLeft(index: StateIndex, left: number) {
    const state = this.getExistState(index);
    if (state.composite) throw new Error('complex state!');
    state.left = left;
  }

  public addStateLeft(index: StateIndex, left: number) {
    if (left === 0) return;
    const state = this.getExistState(index);
    if (state.composite) throw new Error('complex state!');
    state.left += left;
  }

  public maxStateLeft(index: StateIndex, left: number) {
    if (left === 0) return;
    const state = this.getExistState(index);
    if (state.composite) throw new Error('complex state!');
    state.left = Math.max(left, state.left);
  }

  public setStateInfinite(index: StateIndex, infinite: boolean) {
    const state = this.getExistState(index);
    if (state.composite) throw new Error('complex state!');
    state.infinite = infinite;
  }

  public insertStateItem(index: StateIndex, item: StateItem): StateItem {
    const state = this.getExistState(index);
    state.insert(item);
    return item;
  }

  public removeStateItem(index: StateIndex, item: StateItem) {
    const state = this.getExistState(index);
    state.remove(item);
  }

  public clear(index: StateIndex) {
    const state = this.getExistState(index);
    state.clear();
  }

  onTime() {
    const headIndex = this._headIndex;
    for (const state of this.states) {
      if (state.index === headIndex) {
        state.headTime++;
      } else {
        state.headTime = 0;
      }
      state.onTime();
    }
  }

  refresh() {
    for (const state of this.states) {
      state.removeListenersAbsolute();
    }
    this.states.length = 0;
    this.stateMap.clear();
    const block = this.block;
    for (const v of Object.values(block)) {
      if (typeof v === 'number') {
        this.registerState(v);
      } else {
        this.registerState(v.priority, v.composite);
      }
    }
  }
}