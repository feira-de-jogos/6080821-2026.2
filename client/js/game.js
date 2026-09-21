import config from "./config.js";
import Start from "./scenes/start.js";
import Preloader from "./scenes/preloader.js";
import Level1 from "./scenes/level1.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add("Start", Start);
    this.scene.add("Preloader", Preloader);
    this.scene.add("Level1", Level1);
    
    this.scene.start("Start");
  }
}

window.onload = () => {
  const game = new Game();
};
