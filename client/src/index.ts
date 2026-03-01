// TODO: Pixi Client

import { Application, Container, Point, Rectangle, Ticker } from "pixi.js";
import State from "./util/state";

const TRAVEL = 10;
const SCALE = 0.025;
const DEFAULT_SIZE = 500;

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

	tree.addChild(
		new State(0, 0, DEFAULT_SIZE, DEFAULT_SIZE / 3, {
			leftA: 4,
			rightA: 5,
			upA: 7,
		}),
	);

	tree.position.set(window.innerWidth / 2, window.innerHeight / 2);

	tree.pivot.set(tree.width / 2, tree.height / 2);

	app.ticker.add((time) => {
		updateInput(tree, time);
	});
})();
