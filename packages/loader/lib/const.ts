export enum NetFileLoadType {
  Image = 2,
  Audio = 3,
  Video = 4,
  FetchBuffer = 5,
  FetchBlob = 6,
  FetchJson = 7,
  FetchText = 8
}

export type NetFileDataType = {
  [NetFileLoadType.Image]: HTMLImageElement
  [NetFileLoadType.Audio]: HTMLAudioElement
  [NetFileLoadType.Video]: HTMLVideoElement
  [NetFileLoadType.FetchBuffer]: ArrayBuffer
  [NetFileLoadType.FetchBlob]: Blob
  [NetFileLoadType.FetchJson]: Object
  [NetFileLoadType.FetchText]: string
}