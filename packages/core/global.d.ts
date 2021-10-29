type AtomEvents = 'time' | `time_${number}`
  | 'runchange' | 'start' | 'stop'
  | 'getworld' | 'losechild' | 'loseparent' | 'loseworld' | 'getchild' | 'getparent'
  | 'destroy' | 'movex' | 'movey' | 'changey' | 'changex'
  | 'getatom' | 'loseatom'

declare namespace GlobalMixins {
  type WholeAtomEvents = GlobalMixins.AtomEventsHelper[keyof GlobalMixins.AtomEventsHelper]

  interface AtomEventsHelper {
    constructor: AtomEvents
    stateController: 'losestate' | 'getstate' | `losestate${number}` | `getstate_${number}` | 'headstatechange'
  }
}
