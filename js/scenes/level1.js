class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");

    this.threshold = 0.1;
    this.speed = 200;
    this.direction = undefined;
  }

  create() {
    this.tilemap = this.make.tilemap({ key: "map" });

    this.tilesetGrass = this.tilemap.addTilesetImage("grass");
    this.tilesetShadows = this.tilemap.addTilesetImage("shadows");
    this.tilesetItems = this.tilemap.addTilesetImage("items");

    this.layerFloor = this.tilemap.createLayer("floor", [this.tilesetGrass]);
    this.layerShadows = this.tilemap.createLayer("shadows", [
      this.tilesetShadows,
    ]);
    this.layerObjects = this.tilemap.createLayer("objects", [
      this.tilesetItems,
    ]);

    this.anims.create({
      key: "player-stop",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 14,
        end: 14,
      }),
      frameRate: 1,
    });

    this.anims.create({
      key: "player-up",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 60,
        end: 67,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "player-down",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 78,
        end: 86,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "player-left",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 69,
        end: 77,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "player-right",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 87,
        end: 95,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.player = this.physics.add.sprite(400, 300, "ederson", 14);
    this.cameras.main.startFollow(this.player);

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 350,
      radius: 50,
      base: this.add.circle(0, 0, 50, 0xcccccc),
      thumb: this.add.circle(0, 0, 25, 0x666666),
    });

    this.joystick.on("update", () => {
      const angle = Phaser.Math.DegToRad(this.joystick.angle);
      const force = this.joystick.force;

      if (force > this.threshold) {
        this.direction = new Phaser.Math.Vector2(
          Math.cos(angle),
          Math.sin(angle),
        ).normalize();

        const x = this.direction.x * this.speed;
        const y = this.direction.y * this.speed;

        this.player.setVelocity(x, y);

        switch (true) {
          // up
          case this.direction.x > -0.5 &&
            this.direction.x < 0.5 &&
            this.direction.y < 0:
            this.player.play("player-up", true);
            break;
          // down
          case this.direction.x > -0.5 &&
            this.direction.x < 0.5 &&
            this.direction.y > 0:
            this.player.play("player-down", true);
            break;
          // left
          case this.direction.x < 0 &&
            this.direction.y > -0.5 &&
            this.direction.y < 0.5:
            this.player.play("player-left", true);
            break;
          //right
          case this.direction.x > 0 &&
            this.direction.y > -0.5 &&
            this.direction.y < 0.5:
            this.player.play("player-right", true);
            break;
        }
      } else {
        this.player.setVelocity(0, 0);
        this.player.play("player-stop", true);
      }
    });
  }
}

export default Level1;
