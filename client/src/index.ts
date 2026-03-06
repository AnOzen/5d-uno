// TODO: Pixi Client

import { Application, Container, Ticker } from "pixi.js";
import State from "./util/state";
import Card from "./util/card";

const TRAVEL = 10;
const SCALE = 0.025;
const DEFAULT_SIZE = 500;

let CHOSEN: [[number, number], Card] = [[0, 0], new Card(0)];
let states: State[] = [];

export function setChosen(coords: [number, number], card: Card) {
	console.log("New Card! ", card.type);
	console.log(states);
	CHOSEN = [coords, card];
	states.forEach((state) => {
		console.log(coords, state.coords);
		if (state.coords == coords) {
			state.chooseCard(card.type);
		}
	});
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
				tree.y -= moveSpeed;
				break;
			case "s":
				tree.y += moveSpeed;
				break;
			case "a":
				tree.x -= moveSpeed;
				break;
			case "d":
				tree.x += moveSpeed;
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

	let tree = new Container();
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

	tree.position.set(window.innerWidth / 2, window.innerHeight / 2);

	tree.pivot.set(tree.width / 2, tree.height / 2);

	app.ticker.add((time) => {
		updateInput(tree, time);
	});
})();
