// TODO: Pixi Client

import { Assets, Container, Graphics, Text, Texture, Ticker } from "pixi.js";
import { ButtonContainer, Input, List } from "@pixi/ui";
import State from "./util/state";
import Card from "./util/card";
import { ATLAS } from "./util/atlas";
import TTF from "./res/font.ttf";
import { APP } from "./index";
import "@pixi/layout";

const TRAVEL = 10;
const SCALE = 0.025;
const DEFAULT_SIZE = 500;

let keyspressed: string[] = [];

let CHOSEN: [[number, number], Card, number] = [[0, 0], null, -1];
let states: State[] = [];
let USER: string;
let GAME: string;
export let TURN = 0;
let players: string[] = [];
export let offset: number;
let ready: boolean = false;

let tree = new Container();

export const CARDS: Record<string, Texture> = await Assets.load(ATLAS);

await Assets.load({
	src: TTF,
	data: {
		family: "Arimo",
	},
});

const server = new WebSocket("ws://localhost:7765");

server.onopen = () => {
	console.log("Server Connected.");
};

window.onkeydown = (key) => {
	keyspressed.push(key.key);
};

window.onkeyup = (key) => {
	keyspressed.splice(keyspressed.indexOf(key.key), 1);
};

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

function isValid(card: Card, coords: [number, number]) {
	return CHOSEN[1] != null && CHOSEN[0][0] == TURN && coords[0] <= TURN;
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

export function makePlay(coords: [number, number], card: Card, draw: boolean) {
	if (isValid(card, coords)) {
		let ch = getState(CHOSEN[0]);
		let tar = getState(coords);

		let hd = [...ch.meta.hand];
		hd.splice(CHOSEN[2], 1);

		let y = findY(coords[0] + 1, coords[1]);
		states.push(
			new State(coords[0] + 1, coords[1] + y, 0, 0, {
				leftA: 0,
				rightA: 0,
				upA: 0,
				middle: 0,
				hand: [0],
				yourName: "1",
				leftName: "2",
				rightName: "3",
				upName: "4",
			}),
		);
		let y2 = findY(CHOSEN[0][0] + 1, CHOSEN[0][1]);
		states.pop();
		if (coords == CHOSEN[0]) {
			let st;
			if (!draw) {
				st = new State(
					coords[0] + 1,
					coords[1] + y,
					DEFAULT_SIZE,
					DEFAULT_SIZE / 3,
					{
						leftA: tar.meta.leftA,
						upA: tar.meta.upA,
						rightA: tar.meta.rightA,
						hand: hd,
						middle: CHOSEN[1].type,
						yourName: players[offset % 4],
						leftName: players[(offset + 1) % 4],
						rightName: players[(offset + 3) % 4],
						upName: players[(offset + 2) % 4],
					},
				);
			} else {
				// let hand = [...hd].concat([])
				st = new State(
					coords[0] + 1,
					coords[1] + y,
					DEFAULT_SIZE,
					DEFAULT_SIZE / 3,
					{
						leftA: tar.meta.leftA,
						upA: tar.meta.upA,
						rightA: tar.meta.rightA,
						hand: hd,
						middle: CHOSEN[1].type,
						yourName: players[offset % 4],
						leftName: players[(offset + 1) % 4],
						rightName: players[(offset + 3) % 4],
						upName: players[(offset + 2) % 4],
					},
				);
			}

			states.push(st);
			tree.addChild(st);
		} else {
			let st1 = new State(
				coords[0] + 1,
				coords[1] + y,
				DEFAULT_SIZE,
				DEFAULT_SIZE / 3,
				{
					leftA: tar.meta.leftA,
					rightA: tar.meta.upA,
					upA: tar.meta.rightA,
					hand: [...tar.meta.hand],
					middle: CHOSEN[1].type,
					yourName: players[offset % 4],
					leftName: players[(offset + 1) % 4],
					rightName: players[(offset + 3) % 4],
					upName: players[(offset + 2) % 4],
				},
			);

			let st2 = new State(
				CHOSEN[0][0] + 1,
				CHOSEN[0][1] + y2,
				DEFAULT_SIZE,
				DEFAULT_SIZE / 3,
				{
					leftA: ch.meta.leftA,
					upA: ch.meta.upA,
					rightA: ch.meta.rightA,
					hand: hd,
					middle: ch.meta.middle,
					yourName: players[offset % 4],
					leftName: players[(offset + 1) % 4],
					rightName: players[(offset + 3) % 4],
					upName: players[(offset + 2) % 4],
				},
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
		x: (APP.screen.width / 2 - tree.x) / oldScale,
		y: (APP.screen.height / 2 - tree.y) / oldScale,
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

let names: List;

function updateNames(namel: string[], ready: boolean[]) {
	names.removeChildren();
	for (let name of namel) {
		let r = ready[namel.indexOf(name)];
		names.addChild(
			new Text({
				text: name,
				style: {
					fontFamily: "Arimo",
					fontSize: 30,
					fill: r ? "lightgreen" : "darkred",
				},
			}),
		);
	}
	players = namel;
	offset = players.indexOf(USER);
}

function lobby() {
	APP.stage.removeChildren();

	let plays = new Container();
	plays.addChild(
		new Graphics().rect(0, 0, 300, 500).fill(0x789abc).stroke({
			width: 5,
			color: 0xdddddd,
			alignment: 1,
		}),
	);
	names = new List({
		maxWidth: 300,
		maxHeight: 500,
		type: "vertical",
		elementsMargin: 10,
		padding: 20,
	});
	plays.addChild(names);

	plays.pivot.set(plays.width / 2, plays.height / 2);
	plays.position.set(APP.screen.width / 2, APP.screen.height / 2);

	APP.stage.addChild(plays);

	let start = new ButtonContainer();
	start.addChild(
		new Graphics().rect(0, 0, 200, 75).fill(0xff0000).stroke({
			width: 5,
			color: 0xdddddd,
			alignment: 1,
		}),
	);
	let t = new Text({
		text: "Ready",
		style: {
			fontFamily: "Arimo",
			fontSize: 30,
		},
	});
	t.pivot.set(t.width / 2, t.height / 2);
	t.position.set(start.width / 2, start.height / 2);
	start.addChild(t);

	start.onPress.connect(() => {
		if (!ready) {
			start.removeChildAt(0);
			start.addChildAt(
				new Graphics().rect(0, 0, 200, 75).fill(0x00ff00).stroke({
					width: 5,
					color: 0xdddddd,
					alignment: 1,
				}),
				0,
			);
			let pl = new Text({
				text: "Unready",
				style: {
					fontFamily: "Arimo",
					fontSize: 30,
				},
			});
			pl.pivot.set(pl.width / 2, pl.height / 2);
			pl.position.set(start.width / 2, start.height / 2);
			start.removeChildAt(1);
			start.addChildAt(pl, 1);
			ready = true;
			server.send(
				JSON.stringify({
					req: "playerready",
					username: USER,
					game: GAME,
					ready: ready,
				}),
			);
		} else {
			start.removeChildAt(0);
			start.addChildAt(
				new Graphics().rect(0, 0, 200, 75).fill(0xff0000).stroke({
					width: 5,
					color: 0xdddddd,
					alignment: 1,
				}),
				0,
			);
			let pl = new Text({
				text: "Ready",
				style: {
					fontFamily: "Arimo",
					fontSize: 30,
				},
			});
			pl.pivot.set(pl.width / 2, pl.height / 2);
			pl.position.set(start.width / 2, start.height / 2);
			start.removeChildAt(1);
			start.addChildAt(pl, 1);
			ready = false;
			server.send(
				JSON.stringify({
					req: "playerready",
					username: USER,
					game: GAME,
					ready: ready,
				}),
			);
		}
	});

	start.position.set(APP.screen.width / 2, (5 * APP.screen.height) / 6);
	start.pivot.set(start.width / 2, start.height / 2);

	APP.stage.addChild(start);
}

function createGame() {
	APP.stage.removeChildren();

	APP.stage.addChild(tree);

	let root = new State(0, 0, DEFAULT_SIZE, DEFAULT_SIZE / 3, {
		leftA: 7,
		rightA: 7,
		upA: 7,
		hand: [1, 1, 1, 1, 1, 1, 1],
		middle: 1,
		yourName: players[offset % 4],
		leftName: players[(offset + 1) % 4],
		rightName: players[(offset + 3) % 4],
		upName: players[(offset + 2) % 4],
	});

	tree.addChild(root);

	states.push(root);

	setTurn(0);

	tree.position.set(APP.screen.width / 2, APP.screen.height / 2);

	tree.pivot.set(tree.width / 2, tree.height / 2);

	APP.ticker.add((time) => {
		updateInput(tree, time);
	});
}

server.onmessage = (data) => {
	let resp = JSON.parse(data.data);
	console.log(resp);
	switch (resp["resp"]) {
		case "listplayers":
			updateNames(resp["players"], resp["ready"]);
	}
};

export async function init() {
	let form = new Container();

	let user = new Input({
		bg: new Graphics().rect(0, 0, 500, 100).fill(0x789abc).stroke({
			width: 5,
			alignment: 1,
			color: 0xdddddd,
		}),
		align: "center",
		textStyle: {
			fontFamily: "Arimo",
			fontSize: 30,
		},
		placeholder: "Username",
	});
	form.addChild(user);

	let game = new Input({
		bg: new Graphics().rect(0, 0, 500, 100).fill(0x789abc).stroke({
			width: 5,
			alignment: 1,
			color: 0xdddddd,
		}),
		align: "center",
		textStyle: {
			fontFamily: "Arimo",
			fontSize: 30,
		},
		placeholder: "Game Room",
	});

	game.y = 110;
	form.addChild(game);

	let join = new ButtonContainer(
		new Graphics().rect(0, 0, 150, 100).fill(0x789abc).stroke({
			width: 5,
			color: 0xdddddd,
			alignment: 1,
		}),
	);
	let t = new Text({
		text: "Join",
		style: {
			fontFamily: "Arimo",
			fontSize: 30,
		},
	});
	t.pivot.set(t.width / 2, t.height / 2);
	t.position.set(join.width / 2, join.height / 2);
	join.addChild(t);

	join.pivot.x = join.width / 2;
	join.y = 220;
	join.x = form.width / 2;

	join.onPress.connect(() => {
		if (user.value.trim() == "" || game.value.trim() == "") return;
		USER = user.value;
		GAME = game.value;
		server.send(
			JSON.stringify({ req: "gamejoin", username: USER, game: GAME }),
		);
		lobby();
	});

	form.addChild(join);

	form.pivot.set(form.width / 2, form.height / 2);
	form.position.set(APP.screen.width / 2, APP.screen.height / 2);

	APP.stage.addChild(form);
}
