import { Assets, Container, Sprite, Text, Texture } from "pixi.js";

import BACK from "../res/uno_back.png";
import RED from "../res/uno_redbg.png";
import BLUE from "../res/uno_bluebg.png";
import { APP } from "..";

const BGS = await Assets.load([BACK, RED, BLUE]);

export default class Card extends Container {
	type: number;
	chosen: boolean;

	constructor(t: number) {
		super();
		this.type = t;
		this.chosen = false;

		let plo;
		let num: number;
		let texture: Texture;
		if (t == 0) plo = BACK;
		else if (t > 0 && t < 27) {
			plo = RED;
			num = (t % 13) - 1;
			let symbol = new Text({
				text: num,
				style: {
					fill: 0xeeeeee,
					fontFamily: "Arimo",
					fontSize: 700,
				},
			});
			texture = APP.renderer.generateTexture(symbol);
		} else if (t > 26 && t < 53) {
			plo = BLUE;
			num = (t % 13) - 1;
			let symbol = new Text({
				text: num,
				style: {
					fill: 0xeeeeee,
					fontFamily: "Arimo",
					fontSize: 700,
				},
			});
			texture = APP.renderer.generateTexture(symbol);
		}

		let car = new Sprite(BGS[plo]);
		this.addChild(car);
		let mid = new Sprite(texture);
		mid.position.set(this.width / 2, this.height / 2);
		mid.pivot.set(mid.width / 2, mid.height / 2);
		this.addChild(mid);

		let right = new Sprite(texture);
		right.scale.set(0.35);
		right.position.set(870, 150);
		right.pivot.set(mid.width / 2, mid.height / 2);
		this.addChild(right);

		let left = new Sprite(texture);
		left.scale.set(0.35);
		left.position.set(130, 1311);
		left.pivot.set(mid.width / 2, mid.height / 2);
		left.rotation = Math.PI;
		this.addChild(left);

		this.pivot.set(this.width / 2, this.height / 2);

		this.setSize(125, 183);
	}

	getColor(num: number): number {
		return ((num + 1) * 1759760505035107) % 0x1000000;
	}
}
