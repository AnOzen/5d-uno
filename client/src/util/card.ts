import { Container, Graphics } from "pixi.js";

export default class Card extends Container {
	type: number;

	constructor(t: number) {
		super();
		this.type = t;
		this.addChild(
			new Graphics().rect(0, 0, 1000, 1462).fill({
				color: this.getColor(t),
			}),
		);
		this.addChild(new Graphics().rect(0, 0, 1000, 500).fill("black"));
		this.pivot.set(this.width / 2, this.height / 2);

		this.setSize(125, 183);
		console.log(this.pivot._x, this.pivot._y);
	}

	getColor(num: number): number {
		return ((num + 1) * 1759760505035107) % 0x1000000;
	}
}
