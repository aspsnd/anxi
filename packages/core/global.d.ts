type QuarkEvents = 'time' | `time_${number}`
  | 'runchange' | 'start' | 'stop'
  | 'getworld' | 'losechild' | 'loseparent' | 'loseworld' | 'getchild' | 'getparent'
  | 'destroy' | 'movex' | 'movey' | 'changey' | 'changex'
  | 'getquark' | 'losequark'

declare namespace GlobalAnxiMixins {
  type WholeQuarkEvents = GlobalAnxiMixins.QuarkEventsHelper[keyof GlobalAnxiMixins.QuarkEventsHelper]

  interface QuarkEventsHelper {
    constructor: QuarkEvents
    stateController: 'losestate' | 'getstate' | `losestate_${number}` | `getstate_${number}` | 'headstatechange'
  }
}
