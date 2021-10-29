declare namespace Matter {
  const controller: import('@anxi/physics').PhysicsControllerFlag;
  export interface Body {
    [controller]: import('@anxi/physics').PhysicsController<true>
  }
  export interface Composite {
    [controller]: import('@anxi/physics').PhysicsController<false>
  }
}