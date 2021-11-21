type QuarkEvents = 'time' | `time_${number}`
  | 'runchange' | 'start' | 'stop'
  | 'getworld' | 'losechild' | 'loseparent' | 'loseworld' | 'getchild' | 'getparent'
  | 'destroy' | 'movex' | 'movey' | 'changey' | 'changex'
  | 'getquark' | 'losequark'

declare namespace GlobalMixins {
  type WholeQuarkEvents = GlobalMixins.QuarkEventsHelper[keyof GlobalMixins.QuarkEventsHelper]

  interface QuarkEventsHelper {
    constructor: QuarkEvents
    stateController: 'losestate' | 'getstate' | `losestate_${number}` | `getstate_${number}` | 'headstatechange'
  }
}
