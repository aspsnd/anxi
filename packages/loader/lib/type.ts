import type { Loader } from "@pixi/loaders";
import type { Resource } from "./Resource";

export interface LoaderMiddleware {
  (this: Loader, resource: Resource, next: () => Promise<void>): Promise<void>;
}

export interface LoaderPlugin {

  add?(): void;

  before?: LoaderMiddleware

  after?: LoaderMiddleware
}