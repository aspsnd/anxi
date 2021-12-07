import { AnxiEventer, AnxiEvent } from "@anxi/core";
import { NetFileDataType, NetFileLoadType } from "./const";

let tempAnchor: HTMLAnchorElement;

export interface NetFileOptions<T extends NetFileLoadType = NetFileLoadType> {
  crossOrigin: boolean | string
  timeout: number
  loadType: T
  weight: number
}
export type SimpleNetFileOptions<T extends NetFileLoadType = NetFileLoadType> = Partial<NetFileOptions<T>>;

const enum NetFileEvent {
  start = 'start',
  load = 'load',
  error = 'error',
  finish = 'finish',
}
/**
 * 单次的网络请求
 */
export class NetFile<T extends NetFileLoadType = NetFileLoadType> extends AnxiEventer<NetFileEvent>{

  data?: NetFileDataType[T]

  static DefaultOptions: NetFileOptions = {
    crossOrigin: false,
    timeout: 0,
    loadType: NetFileLoadType.FetchText,
    weight: 1
  }

  loadingPromise?: Promise<this>
  finished = false

  options: NetFileOptions

  readonly aborter = new AbortController()

  constructor(readonly url: string, readonly parentAborter: AbortController, options: SimpleNetFileOptions) {
    super();
    parentAborter.signal.addEventListener('abort', this.handleParentAbort);
    this.options = Object.assign({}, NetFile.DefaultOptions, options);
    this.options.crossOrigin = options.crossOrigin === true ? 'anonymous' : !options.crossOrigin ? this._determineCrossOrigin(url) : options.crossOrigin;
  }


  handleParentAbort = () => {
    this.aborter.abort();
  }


  async load() {
    if (this.finished) return this;
    if (this.loadingPromise) return await this.loadingPromise;

    this.loadingPromise = (async (): Promise<this> => {
      this.emit(new AnxiEvent('begin'));
      try {
        let promise: Promise<this>;
        switch (this.options.loadType) {
          case NetFileLoadType.Image: promise = this.loadByImage(); break;
          case NetFileLoadType.Audio: promise = this.loadByImage(); break;
          case NetFileLoadType.Video: promise = this.loadByImage(); break;
          case NetFileLoadType.FetchBuffer: promise = this.loadByFetch(); break;
          case NetFileLoadType.FetchJson: promise = this.loadByFetch(); break;
          case NetFileLoadType.FetchText: promise = this.loadByFetch(); break;
          case NetFileLoadType.FetchBlob: promise = this.loadByFetch(); break;
        }
        this.options.timeout && setTimeout(() => {
          if (this.finished) return;
          this.aborter.abort();
        }, this.options.timeout);
        this.aborter.signal.addEventListener('abort', this.handleAbort);
        const result = await promise;
        this.emit(new AnxiEvent('load'));
        return result;
      } catch (e) {
        this.emit(new AnxiEvent('error', e));
        throw e;
      } finally {
        this.aborter.signal.removeEventListener('abort', this.handleAbort);
        this.finished = true;
        this.emit(new AnxiEvent('finish'));
      }
    })();

    return await this.loadingPromise;
  }

  private async loadByImage(): Promise<this> {
    const img = new Image();
    this.data = img as NetFileDataType[T];
    img.src = this.url;
    img.crossOrigin = this.options.crossOrigin as string;
    return new Promise((resolve, reject) => {
      this.handleAbort = () => {
        if (this.finished) return;
        img.onload = null;
        reject('abort');
      }
      img.onload = () => {
        resolve(this);
      }
      img.onerror = (e) => {
        reject(e);
      }
    })
  }

  private async loadByFetch(): Promise<this> {
    const response = await fetch(this.url, {
      method: 'GET',
      signal: this.aborter.signal
    });
    let result;
    switch (this.options.loadType) {
      case NetFileLoadType.FetchBlob: result = await response.blob(); break;
      case NetFileLoadType.FetchBuffer: result = await response.arrayBuffer(); break;
      case NetFileLoadType.FetchJson: result = await response.json(); break;
      case NetFileLoadType.FetchText: result = await response.text(); break;
    }
    this.data = result as NetFileDataType[T];
    return await this;
  }

  private handleAbort = () => { }

  // private handleLoaded = () => { }

  // private handleFinish = () => { }

  // private handleError = () => { }

  _determineCrossOrigin(url: string, loc?: Location): string {
    // data: and javascript: urls are considered same-origin
    if (url.indexOf('data:') === 0) {
      return '';
    }
    // A sandboxed iframe without the 'allow-same-origin' attribute will have a special
    // origin designed not to match self.location.origin, and will always require
    // crossOrigin requests regardless of whether the location matches.
    if (self.origin !== self.location.origin) {
      return 'anonymous';
    }

    // default is self.location
    loc = loc || self.location;

    tempAnchor = tempAnchor ?? document.createElement('a');
    tempAnchor.href = url;

    // if cross origin
    if (tempAnchor.host !== loc.hostname || loc.port === tempAnchor.port || loc.protocol === tempAnchor.protocol) {
      return 'anonymous';
    }
    return '';
  }

}