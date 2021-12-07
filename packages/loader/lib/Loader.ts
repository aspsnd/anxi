import { AnxiEvent, AnxiEventer } from "@anxi/core";
import { NetFileLoadType } from "./const";
import { Resource, ResourceOptions, ResourceEvent } from "./Resource";
import { nextQueues } from "./tool/AsyncQueue";
import { getExtension } from "./tool/extension";
import { LoaderMiddleware, LoaderPlugin } from "./type";

export interface LoaderAddFunction extends GlobalAnxiMixins.LoaderAddFunctions {
  (url: string): Loader
  (name: string, url: string): Loader
  (options: ResourceOptions): Loader
  (resources: (string | ResourceOptions)[]): Loader
}

export type LoaderEvents = 'progress';
/**
 * 加载器，可以加载多个资源
 */
export class Loader extends AnxiEventer<LoaderEvents> {

  private static plugins: LoaderPlugin[] = []

  static registerPlugin(plugin: LoaderPlugin) {
    this.plugins.push(plugin);
    if (plugin.add) {
      plugin.add();
    }
    return this;
  }

  /**
   * 不是精确值
   */
  get progress() {
    return this.currentWeights && this.currentWeights / this.wholeWeights;
  }
  wholeWeights = 0
  currentWeights = 0

  static loaders: Loader[] = []

  static orphanResources: Resource[] = []

  static findResource(name: string): Resource | undefined {
    for (const loader of this.loaders) {
      if (loader.resources.has(name)) {
        return loader.resources.get(name);
      }
    }
    return this.orphanResources.find(r => r.options.name === name);
  }

  constructor(empty = false) {
    super();
    if (!empty) {
      for (const plugin of Loader.plugins) {
        const { before, after } = plugin;
        before && this.before(before);
        after && this.after(after);
      }
    }
    Loader.loaders.push(this);
  }

  readonly resources: Map<string, Resource> = new Map()

  get(name: string, _async: boolean = false): typeof _async extends true ? (Promise<Resource | undefined>) : (Resource | undefined) {
    const resource = this.resources.get(name);
    // @ts-ignore
    if (resource) return _async ? resource.load() : resource;
    const ice = Loader.findResource(name);
    if (ice) {
      console.warn(`you has got a resource ${name} from another loader.`);
      // @ts-ignore
      return _async ? ice.load() : ice;
    }
    console.warn(`There is no resource named ${name}.`);
    // @ts-ignore
    return _async ? Promise.resolve(undefined) : undefined;
  }
  async getAsync(name: string) {
    return await this.resources.get(name)?.load();
  }


  private beforeMiddlewares: LoaderMiddleware[] = [];

  before(before: LoaderMiddleware) {
    this.beforeMiddlewares.push(before);
  }

  private afterMiddlewares: LoaderMiddleware[] = [];

  after(after: LoaderMiddleware) {
    this.afterMiddlewares.push(after);
  }

  add!: LoaderAddFunction

  async loadResource(resource: Resource) {
    await nextQueues(
      this.beforeMiddlewares,
      async (fn: any, next) => {
        await fn.call(this, resource, async () => {
          next(resource.finished ? {} : undefined);
        });
      },
      true
    );
    if (!resource.finished) {
      await resource.load();
    }
    await nextQueues(
      this.afterMiddlewares,
      async (fn: any, next) => {
        await fn.call(this, resource, next);
      },
      true
    );
    return resource;
  }

  async load() {
    const promises = [];
    for (const resource of this.resources.values()) {
      if (resource.loadingPromise) return;
      promises.push(this.loadResource(resource));
    }
    return Promise.allSettled(promises);
  }

  clone() {
    const loader = new Loader(true);
    loader.beforeMiddlewares = Array.from(this.beforeMiddlewares);
    loader.afterMiddlewares = Array.from(this.afterMiddlewares);
    loader.extensions = new Map(this.extensions.entries());
    return loader;
  }

  destroy(deleteResources: boolean) {
    if (deleteResources) {
      for (const resource of this.resources.values()) {
        resource.destroy();
      }
    } else {
      Loader.orphanResources.push(...this.resources.values());
    }
    this.resources.clear();
    this.removeListenersAbsolute();
    Loader.loaders.splice(Loader.loaders.indexOf(this), 1);
  }

  public addResource(resource: Resource) {
    if (this.resources.has(resource.options.name)) throw new Error(`There is already a resource named ${resource.options.name}`);
    this.resources.set(resource.options.name, resource);
    const weight = resource.options.weight || 1;
    this.wholeWeights += weight;
    resource.on(ResourceEvent.progress, e => {
      this.currentWeights += e.data[0] / weight;
      this.emit(new AnxiEvent('progress'));
    });
    resource.once(ResourceEvent.finish, () => {
      resource.removeListenerByName(ResourceEvent.progress);
    })
  }

  private extensions = new Map<string, NetFileLoadType>();
  public registerExtensionParser(ext: string, loadType: NetFileLoadType, force = false) {
    if (this.extensions.has(ext) && !force) {
      console.warn(`The extension ${ext} has exists, try call this function with setting the third param force to be true.`);
      return;
    }
    this.extensions.set(ext, loadType);
  }

  protected parseUrl2Resource(url: string): ResourceOptions {
    const ext = getExtension(url);
    const loadType = this.extensions.get(ext) ?? NetFileLoadType.FetchText;
    return {
      name: '$untitled$',
      files: {
        main: {
          url,
          loadType,
        }
      }
    }
  }

}

// @ts-ignore
Loader.prototype.add = function (this: Loader, p1: any, p2: any) {
  if (p2) {
    if (typeof p1 !== 'string' || typeof p2 !== 'string') throw new Error('Unsupported parameters');
    const config = this.parseUrl2Resource(p2);
    config.name = p1;
    const resource = new Resource(config);
    this.addResource(resource);
    return this;
  }
  if (Array.isArray(p1)) {
    for (const i of p1) {
      this.add(i);
    }
    return;
  }
  if (typeof p1 === 'string') {
    const config = this.parseUrl2Resource(p1);
    config.name = p1;
    const resource = new Resource(config);
    this.addResource(resource);
    return this;
  }
  const resource = new Resource(p1);
  this.addResource(resource);
  return this;
}