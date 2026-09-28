class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");

    this.threshold = 0.1;
    this.speed = 200;
    this.direction = undefined;
  }

  create() {
    // lights
    this.lights.enable().setAmbientColor(0x101010);

    // map
    this.tilemap = this.make.tilemap({ key: "map" });

    // tilesets
    this.tilesetGrass = this.tilemap.addTilesetImage("grass");
    this.tilesetShadows = this.tilemap.addTilesetImage("shadows");
    this.tilesetItems = this.tilemap.addTilesetImage("items");

    // layers
    this.layerFloor = this.tilemap
      .createLayer("floor", [this.tilesetGrass])
      .setLighting(true);
    this.layerShadows = this.tilemap
      .createLayer("shadows", [this.tilesetShadows])
      .setLighting(true);
    this.layerObjects = this.tilemap
      .createLayer("objects", [this.tilesetItems])
      .setLighting(true);

    // animations
    // stop
    this.anims.create({
      key: "player-stop",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 14,
        end: 14,
      }),
      frameRate: 1,
    });
    // up
    this.anims.create({
      key: "player-up",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 60,
        end: 67,
      }),
      frameRate: 12,
      repeat: -1,
    });
    // down
    this.anims.create({
      key: "player-down",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 78,
        end: 86,
      }),
      frameRate: 12,
      repeat: -1,
    });
    // left
    this.anims.create({
      key: "player-left",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 69,
        end: 77,
      }),
      frameRate: 12,
      repeat: -1,
    });
    // right
    this.anims.create({
      key: "player-right",
      frames: this.anims.generateFrameNumbers("ederson", {
        start: 87,
        end: 95,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // player
    this.player = this.physics.add
      .sprite(400, 300, "ederson", 14)
      .setLighting(true);

    // player backlight
    this.backlight = this.lights
      .addLight(this.player.x, this.player.y, 200)
      .setColor(0xffffff)
      .setIntensity(2);

    // camera
    this.cameras.main.startFollow(this.player);

    // joystick
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

    // collisions
    this.layerObjects.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.layerObjects);

    // mqtt
    this.mqtt = this.registry.get("mqtt");
    this.lastPublish = 0;
    this.publishInterval = 100;

    this.onPlayerMove = (data) => this.handlePlayerMove(data);
    this.mqtt.on("message:level1/#", this.onPlayerMove);
    this.mqtt.subscribe("level1/#");

    this.events.on("shutdown", () => {
      this.mqtt.off("message:level1/#", this.onPlayerMove);
    });
  }

  handlePlayerMove(data) {
    if (data.clientId === this.mqtt.clientId) return;
    console.log(`Received player move from client "${data.clientId}":`, data);
  }

  update(time) {
    // backlight position
    this.backlight.x = this.player.x;
    this.backlight.y = this.player.y;

    // publish player position at a throttled rate
    if (time - this.lastPublish > this.publishInterval) {
      this.lastPublish = time;
      this.mqtt.publish("level1/player-move", {
        clientId: this.mqtt.clientId,
        x: this.player.x,
        y: this.player.y,
        texture: this.player.texture.key,
        frame: this.player.frame.name,
      });
    }
  }
}

export default Level1;
