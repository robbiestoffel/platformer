
let pl, keys, plats, coins, go


function preload() {
  this.load.image('bg', './assets/backg.png')
  this.load.image('coin', './assets/coin.png')
  this.load.image('bad', './assets/bad-guy.png')
  this.load.image('pf', './assets/platform.png')
  this.load.image('go', './assets/game-over.png')
  this.load.spritesheet('pl', './assets/good-guy.png',
  {frameWidth: 17, frameHeight: 30}
  )
  this.load.audio('pickup', './assets/coinsound.wav')
  this.load.audio('bs', './assets/backsound.wav')
}

function create() {
  let bs = this.sound.add('bs',{
    loop: true,
    
  })
  bs.play()


  this.add.image(0,0,'bg').setOrigin(0,0)
  pl = this.physics.add.sprite(100,100,'pl')
  pl.setCollideWorldBounds(true)
  pl.setScale(2)
  pl.setGravityY(1200)

  bad = this.physics.add.sprite(100,100,'bad')
  bad.setCollideWorldBounds(true)
  bad.setScale(2)
  bad.setBounce(1)
  bad.setVelocity(200)

  plats = this.physics.add.staticGroup()
  plats.create(500,350,'pf').setScale(4,1).refreshBody()
  plats.create(300,100,'pf').setScale(4,1).refreshBody()
  plats.create(200,275,'pf').setScale(4,1).refreshBody()
  plats.create(725,200,'pf').setScale(4,1).refreshBody()


  coins = this.physics.add.staticGroup()
  coins.create(30,25,'coin')
  coins.create(300,300,'coin')
  coins.create(20,300,'coin')
  coins.create(400,90,'coin')
  coins.create(350,300,'coin')
  coins.create(320,500,'coin')
  coins.create(100,300,'coin')
  coins.create(150,25,'coin')


    let score = 0
    scoreText = this.add.text(16,16, 'Score: 0',{
      color: 'red',
      fontSize: '64px',
      fontFamily: 'cursive',
    })
    
    let pickup = this.sound.add('pickup')

    function collectCoin(pl,coin) {
      pickup.play()
      score += 1
      scoreText.setText(`Score: ${score}`)
      coin.destroy()
    }
 
    function hitBad(pl,bad) {
      bad.destroy()
      this.add.image(0,0,'go').setOrigin(0,0)
      go = true
    }


  this.physics.add.collider(pl,plats)
  this.physics.add.collider(pl, coins, collectCoin)
  this.physics.add.collider(bad, plats)
  this.physics.add.collider(pl, bad, hitBad, null, this)

  /** 
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('gp'),
    framerate: 1,
    repeat: -1,
  })
  **/
  keys = this.input.keyboard.createCursorKeys()
}

function update() {
  
  if (keys.left.isDown) {
    pl.setVelocityX(-400)
  }

  if (keys.right.isDown) {
    pl.setVelocityX(400)
  }

  if (pl.body.onFloor()) {
    pl.setDragX(1000)
    if (keys.up.isDown) {
      pl.setVelocityY(-500)
    }
  } else {
    pl.setDragY
  }
  if (go && keys.space.isDown) {
    go = false
    this.create()
  }

}

let config = {
  width: 683,
  height: 384,
  pixelArt: true,
  scene: {preload,create,update,},
  physics: { default: 'arcade' },
}

 new Phaser.Game(config)