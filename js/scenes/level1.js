class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  create() {
    this.add.image(400, 225, "start-background");
  }
}

export default Level1;
