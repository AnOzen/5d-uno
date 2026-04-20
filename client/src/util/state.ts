import { Container, Graphics, Text } from "pixi.js";
import Meta from "./meta";
import Card from "./card";
import { makePlay, offset, setChosen, TURN } from "../game";

function mod(n: number, m: number): number {
	return ((n % m) + m) % m;
}

export default class State extends Container {
	graphics: Graphics;
	size: number;
	margin: number;
	index: number;
	meta: Meta;
	hand: Card[] = [];
	chosen: Graphics;
	coords: [number, number];
	ptxts: Text[];

	constructor(x: number, y: number, size: number, margin: number, meta: Meta) {
		super();
		this.graphics = new Graphics();
		this.size = size;
		this.margin = margin;
		this.meta = meta;
		this.coords = [x, y];
		let mask = new Graphics().rect(0, 0, 1000, 1000).fill("white");
		this.mask = mask;

		this.addChild(this.graphics.rect(0, 0, 1000, 1000).fill("grey"));
		this.addChild(mask);

		this.ptxts = [];

		for (let i = 1; i <= meta.leftA; i++) {
			let card = new Card(0);

			card.rotation = Math.PI / 2;
			card.position.set(20, (800 / (meta.leftA + 1)) * i + 100);

			this.addChild(card);
		}

		const text = new Text({
			text: meta.leftName,
			style: {
				fill: "#000000",
				fontSize: 60,
				fontFamily: "Arimo",
			},
			anchor: 0.5,
		});
		text.rotation = Math.PI / 2;
		text.position.set(150, this.height / 2);
		this.addChild(text);

		for (let i = 1; i <= meta.rightA; i++) {
			let card = new Card(0);

			card.rotation = (3 * Math.PI) / 2;
			card.position.set(980, (800 / (meta.rightA + 1)) * i + 100);
			this.addChild(card);
		}

		const text2 = new Text({
			text: meta.rightName,
			style: {
				fill: "#000000",
				fontSize: 60,
				fontFamily: "Arimo",
			},
			anchor: 0.5,
		});
		text2.rotation = (3 * Math.PI) / 2;
		text2.position.set(850, this.height / 2);
		this.addChild(text2);

		for (let i = 1; i <= meta.upA; i++) {
			let card = new Card(0);

			card.rotation = Math.PI;
			card.position.set((800 / (meta.upA + 1)) * i + 100, 20);
			this.addChild(card);
		}

		const text3 = new Text({
			text: meta.upName,
			style: {
				fill: "#000000",
				fontSize: 60,
				fontFamily: "Arimo",
			},
			anchor: 0.5,
		});
		text3.position.set(this.width / 2, 150);
		this.addChild(text3);

		const text4 = new Text({
			text: meta.yourName,
			style: {
				fill: "#000000",
				fontSize: 60,
				fontFamily: "Arimo",
			},
			anchor: 0.5,
		});
		text4.position.set(this.width / 2, 850);
		this.addChild(text4);

		for (let i = 1; i <= meta.hand.length; i++) {
			let card = new Card(meta.hand[i - 1]);
			card.cursor = "pointer";

			card.position.set((800 / (meta.hand.length + 1)) * i + 100, 980);

			card.eventMode = "static";
			card.on("pointerenter", () => {
				if (!card.chosen && this.coords[0] == TURN) card.y -= 50;
			});
			card.on("pointerleave", () => {
				if (!card.chosen && this.coords[0] == TURN) card.y += 50;
			});

			card.on("pointertap", () => {
				setChosen(this.coords, card, i - 1);
			});
			this.addChild(card);
			this.hand.push(card);
		}

		this.ptxts = [text4, text, text3, text2];
		this.ptxts = this.ptxts.filter((text) => !(text.text.length == 0));
		this.ptxts[mod(x - offset, this.ptxts.length)].style.fill = "#ff0000";
		this.ptxts[mod(x - offset, this.ptxts.length)].style.stroke = {
			width: 7,
			color: "#ffffff",
			alignment: 0,
			join: "round",
		};

		let macard = new Card(meta.middle);
		this.addChild(macard);

		macard.cursor = "pointer";
		macard.position.set((2 * this.width) / 3, this.height / 2);
		macard.scale.set(macard.scale._x + 0.1);

		macard.eventMode = "static";
		macard.on("pointertap", () => {
			makePlay(this.coords, macard, false);
		});

		let drawpile = new Card(0);
		this.addChild(drawpile);

		drawpile.cursor = "pointer";
		drawpile.position.set(this.width / 3, this.height / 2);
		drawpile.scale.set(drawpile.scale._x + 0.1);

		drawpile.eventMode = "static";
		drawpile.on("pointertap", () => {
			makePlay(this.coords, drawpile, true);
		});

		this.setSize(size);
		this.pos(x, y);
	}

	pos(x: number, y: number): void {
		this.position.set(
			x * (this.size + this.margin),
			y * (this.size + this.margin),
		);
	}

	chooseCard(type: number) {
		this.hand.forEach((card) => {
			if (card.type == type) {
				card.chosen = !card.chosen;
			} else {
				card.chosen = false;
				if (card.y == 930) card.y += 50;
			}
		});
	}

	setTurn(turn: boolean) {
		if (turn) {
			this.children[0] = this.graphics.rect(0, 0, 1000, 1000).fill({
				color: 0xdddddd,
			});
		} else {
			this.children[0] = this.graphics.rect(0, 0, 1000, 1000).fill("grey");
		}
	}

	resetCards() {
		this.hand.forEach((card) => {
			card.chosen = false;
			if (card.y == 930) card.y += 50;
		});
	}
}
