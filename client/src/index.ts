// TODO: Pixi Client

import { Application } from "pixi.js";

(async () => {
  const app: Application = new Application();

  await app.init({
    background: "#000000",
    resizeTo: window,
    resolution: 1,
    preference: "webgl",
  });

  document.body.appendChild(app.canvas);
})();
