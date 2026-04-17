import { Container, Graphics, GraphicsContext, Sprite } from "pixi.js";
import { CARDS } from "../game";
import { ATLAS } from "./atlas";

export default class Card extends Container {
	type: number;
	chosen: boolean;

	constructor(t: number) {
		super();
		this.type = t;
		this.chosen = false;

		let plo;
		if(t == 0) plo = 0; else plo = t;
		let car = new Sprite(CARDS[ATLAS[plo]]);
		this.addChild(car);

		this.pivot.set(this.width / 2, this.height / 2);

		this.setSize(125, 183);
	}

	getColor(num: number): number {
		return ((num + 1) * 1759760505035107) % 0x1000000;
	}
}
