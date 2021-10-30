import { Atom, ViewController } from "@anxi/core";
import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";

export interface ParticleViewerOptinos extends EmitterConfigV3 {

}
export class ParticleViewer extends ViewController {

	insertAction(_action: unknown): never {
		throw new Error("Method not implemented.");
	}
	removeAction(_index: number): never {
		throw new Error("Method not implemented.");
	}
	readonly emitter: Emitter
	constructor(public atom: Atom, config: ParticleViewerOptinos) {
		super(atom);
		this.emitter = new Emitter(this.container, config);
		this.emitter.emit = true;
	}
	onRender(delta: number): void {
		this.container.x = this.belonger!.x;
		this.container.y = this.belonger!.y;
		this.emitter.update(delta / 60);
	}
	private _x = 0
	/**
	 * set emitter position for better behavior.
	 */
	set x(v: number) {
		this._x = v;
		this.emitter.updateOwnerPos(v, this._y);
	}
	get x() {
		return this._x;
	}
	private _y = 0
	/**
	 * set emitter position for better behavior.
	 */
	set y(v: number) {
		this._y = v;
		this.emitter.updateOwnerPos(this._x, v);
	}
	get y() {
		return this._y;
	}
}