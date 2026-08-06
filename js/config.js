var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  fps: {
    target: 15,
    forceSetTimeOut: true,
  },
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
  pointers: {
    activePointers: 3,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default config;
