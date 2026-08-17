class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.add.image(400, 225, "start-background");

    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);
    const bar = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);

    this.load.on("progress", (progress) => {
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("./assets/");
    this.load.spritesheet("ederson", "ederson.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.scene.stop();
    this.scene.start("Level1");
  }
}

export default Preloader;
