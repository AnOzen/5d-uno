import { Container, Graphics } from "pixi.js";
import Meta from "./meta";
import Card from "./card";
import { makePlay, setChosen, TURN } from "..";

export default class State extends Container {
	graphics: Graphics;
	size: number;
	margin: number;
	index: number;
	meta: Meta;
	hand: Card[] = [];
	chosen: Graphics;
	coords: [number, number];

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

		for (let i = 1; i <= meta.leftA; i++) {
			let card = new Card(0);

			card.rotation = Math.PI / 2;
			card.position.set(20, (800 / (meta.leftA + 1)) * i + 100);

			this.addChild(card);
		}

		for (let i = 1; i <= meta.rightA; i++) {
			let card = new Card(0);

			card.rotation = (3 * Math.PI) / 2;
			card.position.set(980, (800 / (meta.rightA + 1)) * i + 100);
			this.addChild(card);
		}

		for (let i = 1; i <= meta.upA; i++) {
			let card = new Card(0);

			card.rotation = Math.PI;
			card.position.set((800 / (meta.upA + 1)) * i + 100, 20);
			this.addChild(card);
		}

		for (let i = 1; i <= meta.hand.length; i++) {
			let card = new Card(meta.hand[i - 1]);
			card.cursor = 'pointer';

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

		let macard = new Card(meta.middle);
		macard.cursor = 'pointer';
		macard.position.set(this.width / 2, this.height / 2);
		macard.scale.set(macard.scale._x + 0.1);

		macard.eventMode = 'static';
		macard.on('pointertap', () => {
			makePlay(this.coords, macard);
		})
		this.addChild(macard);

		

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
			this.children[0] = this.graphics
				.rect(0, 0, 1000, 1000)
				.fill({
					color: 0xdddddd
				})
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
