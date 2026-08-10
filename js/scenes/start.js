class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  preload() {
    this.load.image("start-background", "assets/start-background.png");
  }

  create() {
    this.add
      .image(400, 225, "start-background")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop();
        this.scene.start("Preloader");
      });
  }
}

export default Start;
