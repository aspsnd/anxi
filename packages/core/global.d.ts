type QuarkEvents = 'time' | `time_${number}`
  | 'runchange' | 'start' | 'stop'
  | 'getworld' | 'losechild' | 'loseparent' | 'loseworld' | 'getchild' | 'getparent'
  | 'destroy' | 'movex' | 'movey' | 'changey' | 'changex'
  | 'getatom' | 'loseatom'

declare namespace GlobalMixins {
  type WholeQuarkEvents = GlobalMixins.QuarkEventsHelper[keyof GlobalMixins.QuarkEventsHelper]

  interface QuarkEventsHelper {
    constructor: QuarkEvents
    stateController: 'losestate' | 'getstate' | `losestate${number}` | `getstate_${number}` | 'headstatechange'
  }
}
