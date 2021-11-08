import { Loader, LoaderResource } from "pixi.js";

export class AnxiLoader {
  constructor(public proto: Loader = new Loader()) { }
  get<T extends LoaderResource = LoaderResource>(url: string): Promise<T>
  get<T extends LoaderResource = LoaderResource>(name: string, url: string): Promise<T>
  get<T extends LoaderResource = LoaderResource>(...args: [string] | [string, string]): Promise<T> {
    return new Promise(resolve => {
      // @ts-ignore
      this.proto.add(...args, (res: T) => {
        resolve(res);
      }).load();
    })
  }
}
export const asyncLoader = new AnxiLoader(Loader.shared);