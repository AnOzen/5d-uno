// TODO: Pixi Client

import { Application } from "pixi.js";
import State from "./util/state";

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

  let st1 = new State(0, 0, 250, 20);
  let st2 = new State(1, 0, 250, 20);

  app.stage.addChild(st1);
  app.stage.addChild(st2);


  
})();
