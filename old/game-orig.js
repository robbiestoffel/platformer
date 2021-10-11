
let player

new Phaser.Game({
  width: 683, // 1366,
  height: 384, //786
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y:300, x: 100 },
      debug: true
    }
  },
  scene: {
    preload() {
      this.load.image('bg', './assets/background.png')
      this.load.image('gp', './assets/good-guy.png')
    },
    create() {
      this.add.image(0,0,'bg').setOrigin(0,0)
      player = this.physics.add.sprite(100,100,'gp')
      player.setCollideWorldBounds(true)
      player.setBounce(1)
    }
  }
})