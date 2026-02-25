// TODO: Pixi Client

import { Application, Container, Point } from "pixi.js";
import State from "./util/state";

const TRAVEL = 10;

let heldkeys: string[] = [];

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

	tree.addChild(new State(0, 0, 100, 30));

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

	app.ticker.add((time) => {
		heldkeys.forEach((s) => {
			switch (s) {
				case "w":
					tree.position.set(tree.position._x, tree.position._y - TRAVEL);
					break;
				case "s":
					tree.position.set(tree.position._x, tree.position._y + TRAVEL);
					break;
				case "a":
					tree.position.set(tree.position._x - TRAVEL, tree.position._y);
					break;
				case "d":
					tree.position.set(tree.position._x + TRAVEL, tree.position._y);
					break;
			}
		});
	});
})();
