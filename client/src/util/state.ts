import { Container, Graphics, Rectangle, Size } from "pixi.js";
import Meta from "./meta";
import Card from "./card";

export default class State extends Container {
	graphics: Graphics;
	size: number;
	margin: number;
	index: number;
	meta: Meta;

	constructor(x: number, y: number, size: number, margin: number, meta: Meta) {
		super();
		this.graphics = new Graphics();
		this.size = size;
		this.margin = margin;
		this.meta = meta;
		let mask = new Graphics().rect(0, 0, size, size).fill("white");
		this.mask = mask;
		this.addChild(mask);

		this.addChild(this.graphics.rect(0, 0, size, size).fill("grey"));


		let card = new Card(0);
		card.rotation = Math.PI / 2;

		this.addChild(card);
		card.position.set(0, this.width / 2);

		this.pos(x, y);
	}

	pos(x: number, y: number): void {
		this.position.set(
			x * (this.size + this.margin),
			y * (this.size + this.margin),
		);
	}
}
