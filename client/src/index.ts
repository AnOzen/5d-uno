// TODO: Pixi Client

import { Application, Container, Ticker } from "pixi.js";
import State from "./util/state";
import Card from "./util/card";
import Meta from "./util/meta";

const TRAVEL = 10;
const SCALE = 0.025;
const DEFAULT_SIZE = 500;

let CHOSEN: [[number, number], Card, number] = [[0, 0], null, -1];
let states: State[] = [];
export let TURN = 0;

let tree = new Container();

export function setChosen(coords: [number, number], card: Card, index: number) {
	CHOSEN = [coords, card, index];
	states.forEach((state) => {
		if (state.coords == coords) {
			state.chooseCard(card.type);
		} else {
			state.resetCards();
		}
	});
}

function isValid(card: Card) {
	return CHOSEN[1] != null && CHOSEN[0][0] == TURN;
}

function isEqual(c1: [number, number], c2: [number, number]) {
	return c1[0] == c2[0] && c1[1] == c2[1];
}

function getState(coords: [number, number]): State {
	let st: State = null;
	states.forEach((state) => {
		if (isEqual(state.coords, coords) && st == null) {
			st = state;
		}
	});
	return st;
}

function setTurn(turn: number) {
	TURN = turn;
	states.forEach((state) => {
		if (state.coords[0] == TURN) {
			state.setTurn(true);
		} else {
			state.setTurn(false);
		}
	});
}

function findY(x: number, y: number) {
	let yd = 0;
	while (getState([x, y + yd]) != null) {
		yd++;
	}
	return yd;
}

export function makePlay(coords: [number, number], card: Card) {
	if (isValid(card)) {
		let ch = getState(CHOSEN[0]);
		let tar = getState(coords);

		let hd = [...ch.meta.hand];
		hd.splice(CHOSEN[2], 1);

		let y = findY(coords[0] + 1, coords[1]);
		let y2 = findY(CHOSEN[0][0] + 1, CHOSEN[0][1]);
		if (coords[0] == CHOSEN[0][0] && y == y2) {
			let st = new State(
				coords[0] + 1,
				coords[1] + y,
				DEFAULT_SIZE,
				DEFAULT_SIZE / 3,
				new Meta(
					tar.meta.leftA,
					tar.meta.upA,
					tar.meta.rightA,
					hd,
					CHOSEN[1].type,
				),
			);

			states.push(st);
			tree.addChild(st);
		} else {
			let st1 = new State(
				coords[0] + 1,
				coords[1] + y,
				DEFAULT_SIZE,
				DEFAULT_SIZE / 3,
				new Meta(
					tar.meta.leftA,
					tar.meta.upA,
					tar.meta.rightA,
					[...tar.meta.hand],
					CHOSEN[1].type,
				),
			);

			let st2 = new State(
				CHOSEN[0][0] + 1,
				CHOSEN[0][1] + y2,
				DEFAULT_SIZE,
				DEFAULT_SIZE / 3,
				new Meta(
					ch.meta.leftA,
					ch.meta.upA,
					ch.meta.rightA,
					hd,
					ch.meta.middle,
				),
			);

			states.push(st1);
			tree.addChild(st1);
			states.push(st2);
			tree.addChild(st2);
		}

		setChosen([0, 0], null, -1);
		setTurn(coords[0] + 1);
	}
}

window.addEventListener(
	"wheel",
	(event) => {
		const { ctrlKey } = event;
		if (ctrlKey) {
			event.preventDefault();
			return;
		}
	},
	{ passive: false },
);

let heldkeys: string[] = [];

onkeydown = (e) => {
	if (e.repeat) return;
	heldkeys.push(e.key);
};

onkeyup = (e) => {
	let i = heldkeys.indexOf(e.key);
	if (i > -1) {
		heldkeys.splice(i, 1);
	}
};

function updateInput(tree: Container, time: Ticker) {
	let moveSpeed = TRAVEL * time.deltaTime;
	let scaleSpeed = SCALE * time.deltaTime;
	let oldScale = tree.scale.x;

	const worldPos = {
		x: (window.innerWidth / 2 - tree.x) / oldScale,
		y: (window.innerHeight / 2 - tree.y) / oldScale,
	};

	let newScale = oldScale;

	heldkeys.forEach((s) => {
		switch (s) {
			case "w":
				tree.y += moveSpeed;
				break;
			case "s":
				tree.y -= moveSpeed;
				break;
			case "a":
				tree.x += moveSpeed;
				break;
			case "d":
				tree.x -= moveSpeed;
				break;
			case "q":
				newScale = Math.max(oldScale - scaleSpeed, 0.2);
				break;
			case "e":
				newScale = Math.min(oldScale + scaleSpeed, 1.2);
				break;
		}

		if (newScale !== oldScale) {
			tree.scale.set(newScale);

			tree.x = window.innerWidth / 2 - worldPos.x * newScale;
			tree.y = window.innerHeight / 2 - worldPos.y * newScale;
		}
	});
}

(async () => {
	const app: Application = new Application();

	await app.init({
		background: "#FFFFFF",
		resizeTo: window,
		resolution: 1,
		preference: "webgl",
		antialias: true,
	});

	document.body.appendChild(app.canvas);

	app.stage.addChild(tree);

	let root = new State(0, 0, DEFAULT_SIZE, DEFAULT_SIZE / 3, {
		leftA: 4,
		rightA: 5,
		upA: 7,
		hand: [15, 3, 9, 10, 23],
		middle: 42,
	});

	tree.addChild(root);

	states.push(root);

	setTurn(0);

	tree.position.set(window.innerWidth / 2, window.innerHeight / 2);

	tree.pivot.set(tree.width / 2, tree.height / 2);

	app.ticker.add((time) => {
		updateInput(tree, time);
	});
})();
