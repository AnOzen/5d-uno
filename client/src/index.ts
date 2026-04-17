import { Application } from "pixi.js";
import { init } from "./game";

export const APP: Application = new Application();

(async () => {

	await APP.init({
		background: "#FFFFFF",
		resizeTo: window,
		resolution: window.devicePixelRatio,
		preference: "webgl",
		antialias: true,
		autoDensity: true,
	});

	document.body.appendChild(APP.canvas);

	await init();
})();
