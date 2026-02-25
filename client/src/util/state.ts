import { Container, Graphics, Size } from "pixi.js";

export default class State extends Container {
	graphics: Graphics;
	size: number;
	margin: number;

	constructor(x: number, y: number, size: number, margin: number) {
		super();
		this.graphics = new Graphics();
		this.size = size;
		this.margin = margin;

		this.addChild(this.graphics.rect(0, 0, size, size).fill("red"));

		this.pos(x, y);
	}

	pos(x: number, y: number): void {
		this.position.set(
			x * (this.size + this.margin),
			y * (this.size + this.margin),
		);
	}
}
