const keys = 'LEFT,RIGHT,SPACE,UP,W,A,S,D,R'

let pl, k, go, jump, music, enemySpawnTimer
let moreCoinPoints = 0;

const randint = lim => Math.floor(Math.random() * lim)
const rX = () => randint(1024)
const rY = () => randint(768)

class Main extends Phaser.Scene {

  preload() {
    this.load.image('bg', '../game/assets/img/newbackg.png')
    this.load.image('coin', '../game/assets/img/coin.png')
    this.load.image('bad', '../game/assets/img/bad-guy.png')
    this.load.image('pf', '../game/assets/img/platform.png')
    this.load.image('go', '../game/assets/img/game-over.png')
    this.load.spritesheet('pl', '../game/assets/img/good-guy.png', { frameWidth: 17, frameHeight: 30 })
    this.load.audio('pickup', '../game/assets/snd/coinsound.wav')
    this.load.audio('music', '../game/assets/snd/backsound.wav')
    this.load.audio('gos', '../game/assets/snd/game-over.wav')
    this.load.audio('jump', '../game/assets/snd/jump.wav')
    this.load.audio('hit', '../game/assets/snd/collide.wav')
  }

  create() {

    k = this.input.keyboard.addKeys(keys)

    music = this.sound.add('music', { loop: true, volume: .2, })
    let pickup = this.sound.add('pickup')
    let gos = this.sound.add('gos')
    jump = this.sound.add('jump')
    let hit = this.sound.add('hit')
    music.play()

    this.add.image(0, 0, 'bg').setOrigin(0, 0)
    pl = this.physics.add.sprite(100, 100, 'pl')
    pl.setCollideWorldBounds(true)
    pl.setGravityY(1200)

    let bad = this.physics.add.group()

    const spawnEnemy = () => {
      let b = bad.create(rX(), rY(), 'bad')
      b.setCollideWorldBounds(true)
      b.setScale(2)
      b.setBounce(1)
      b.setVelocity(200)
    }

    spawnEnemy()
    enemySpawnTimer = setInterval(spawnEnemy, 10000)

    let plats = this.physics.add.staticGroup()
    plats.create(825, 250, 'pf').setScale(4, 1).refreshBody()
    plats.create(700, 550, 'pf').setScale(4, 1).refreshBody()
    plats.create(290, 150, 'pf').setScale(4, 1).refreshBody()
    plats.create(220, 450, 'pf').setScale(4, 1).refreshBody()
    
    let coins = this.physics.add.staticGroup()
    const spawnCoins = (b) => {
      let a = 0;
      while(a < b){
        coins.create(rX(), rY(), 'coin')
        a++;
      }
    }
    spawnCoins(8)

    let score = 0
    let scoreText = this.add.text(600, 16, 'Score: 0', {
      color: 'red',
      fontSize: '64px',
      fontFamily: 'cursive',
    })
    
    const collectCoin = (pl, coin, moreCoinsPoints) => {
      moreCoinPoints++
      pickup.play()
      if (moreCoinsPoints >= 3) {
        score += 2
      } else {
        score += 1
      }
      scoreText.setText(`Score: ${score}`)
      coin.destroy()
      spawnCoins(1)
    }

    const hitBad = (pl, bad) => {
      pl.setTint('#ff0000')
      music.stop()
      gos.play()
      this.add.image(0, 0, 'go').setOrigin(0, 0)
      go = true
      this.physics.pause()
      clearInterval(enemySpawnTimer)
    }
    
    const setMoreCoinPoints = (pl, plats) => {
      let moreCoinPoints = 0;
    }
    
    this.physics.add.collider(pl, plats, setMoreCoinPoints)
    this.physics.add.overlap(pl, coins, collectCoin)
    this.physics.add.collider(bad, plats)
    this.physics.add.collider(pl, bad, hitBad)

    this.cameras.main.setBounds(0, 0, 1024, 767)
    this.cameras.main.setZoom()

    /** 
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('gp'),
      framerate: 1,
      repeat: -1,
    })
    **/

  }

  update() {
    if (k.LEFT.isDown) {
      pl.setVelocityX(-300)
    }

    if (k.RIGHT.isDown) {
      pl.setVelocityX(300)
    }

    if (pl.body.onFloor()) {
      pl.setDragX(1000)
      if (k.UP.isDown) {
        pl.setVelocityY(-1000)
        jump.play()
      }
    }
    if (k.R.isDown) {
      music.stop()
      this.scene.restart()
    }

  }

}

const game = new Phaser.Game({
  scene: Main,
  physics: {
    default: 'arcade',
    arcade: { debug: false, },
  },
  pixalArt: true,
})

