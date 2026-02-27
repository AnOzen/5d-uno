import { Container, Graphics } from "pixi.js";

export default class Card extends Container {
	type: number;

	constructor(t: number) {
		super();
		this.type = t;
		this.addChild(new Graphics().rect(0, 0, 100, 156).fill("red"));

		this.pivot.set(this.width / 2, this.height / 2);
	}
}
