import { NetFile, SimpleNetFileOptions } from "./NetFile";
import { AnxiEventer, AnxiEvent } from "@anxi/core";
import { NetFileDataType, NetFileLoadType } from "anxi.js";

export type ResourceOptions<T extends Record<string, NetFileLoadType> = Record<string, NetFileLoadType>> = {
  name: string
  files: {
    [key in keyof T]: {
      url: string,
    } & SimpleNetFileOptions<T[key]>
  }
  weight?: number
}
export const enum ResourceEvent {
  start = 'start',
  load = 'load',
  error = 'error',
  finish = 'finish',
  progress = 'progress'
}
/**
 * 一个资源，可以由业务去定义
 * 一个资源对应游戏中的一个完整部分所需的资源
 */
export class Resource<T extends Record<string, NetFileLoadType> = Record<string, NetFileLoadType>, D = unknown> extends AnxiEventer<ResourceEvent> {
  readonly aborter = new AbortController()

  readonly datas: {
    [key in keyof T]?: NetFileDataType[T[key]]
  } = {}

  readonly data?: D

  readonly netFiles: {
    [key in keyof T]?: NetFile<T[key]>
  } = {}

  wholeWeights: number
  currentWeights = 0
  constructor(readonly options: ResourceOptions<T>) {
    super();
    this.wholeWeights = 0;
    for (const i in options.files) {
      this.wholeWeights += options.files[i].weight || 1;
    }
  }

  loadingPromise?: Promise<this>
  finished = false

  async load() {
    if (this.finished) return this;
    if (this.loadingPromise) {
      return await this.loadingPromise;
    }
    this.loadingPromise = (async () => {
      try {
        this.emit(new AnxiEvent('begin'));
        const promises = [];
        for (const name in this.options.files) {
          const { url, ...options } = this.options.files[name];
          promises.push((async () => {
            // @ts-ignore
            const netFile = this.netFiles[name] = await new NetFile(url, this.aborter, options).load();
            this.currentWeights += netFile.options.weight;
            this.emit(new AnxiEvent(ResourceEvent.progress, netFile.options.weight / this.wholeWeights));
          })());
        }
        await Promise.all(promises);
        for (const name in this.options.files) {
          this.datas[name] = this.netFiles[name]!.data;
        }
        this.emit(new AnxiEvent(ResourceEvent.load));
        return this;
      } catch (e) {
        this.aborter.abort();
        throw e;
      } finally {
        this.finished = true;
        this.emit(new AnxiEvent(ResourceEvent.finish));
      }
    })();
    return await this.loadingPromise;
  }

  destroy() {

  }

}