import { Container, Graphics, Rectangle, Size, trimRight } from "pixi.js";
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
		let mask = new Graphics().rect(0, 0, 1000, 1000).fill("white");
		this.mask = mask;
		this.addChild(mask);

		this.addChild(this.graphics.rect(0, 0, 1000, 1000).fill("grey"));

		for (let i = 1; i <= meta.leftA; i++) {
			let card = new Card(0);

			card.rotation = Math.PI / 2;
			card.position.set(50, (800 / (meta.leftA + 1)) * i + 100);
			this.addChild(card);
		}

    for (let i = 1; i <= meta.rightA; i++) {
			let card = new Card(0);

			card.rotation = 3 * Math.PI / 2;
			card.position.set(950, (800 / (meta.rightA + 1)) * i + 100);
			this.addChild(card);
		}

    for (let i = 1; i <= meta.upA; i++) {
			let card = new Card(0);

			card.rotation = Math.PI;
			card.position.set((800 / (meta.upA + 1)) * i + 100, 50);
			this.addChild(card);
		}

    this.setSize(size);

		this.pos(x, y);
	}

	pos(x: number, y: number): void {
		this.position.set(
			x * (this.size + this.margin),
			y * (this.size + this.margin),
		);
	}
}
