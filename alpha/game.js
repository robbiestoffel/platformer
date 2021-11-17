const keys = 'LEFT,RIGHT,SPACE,UP,W,A,S,D,R'

let pl, k, go, jump, music, enemySpawnTimer
let moreCoinPoints = 0;
let score = 0;
let poweredUp = false;
let queuedPower = 0;

const randint = lim => Math.floor(Math.random() * lim)
const rX = () => randint(1024)
const rY = () => randint(768)

class Main extends Phaser.Scene {

    preload() {
        this.load.image('bg', '../game/assets/img/newbackg.png')
        this.load.image('coin', '../game/assets/img/coin.png')
        this.load.image('bad', '../game/assets/img/bad-guy.png')
        this.load.image('pf', '../game/assets/img/platform.png')
        this.load.image('go', '../dungeon/assets/img/DCgameover.png')
        this.load.image('powerup', '../dungeon/assets/img/DCpowerup.png')
        this.load.image('border', '../dungeon/assets/img/DCborder.png')
        this.load.spritesheet('pl', '../game/assets/img/good-guy.png', { frameWidth: 17, frameHeight: 30 })
        this.load.audio('pickup', '../game/assets/snd/coinsound.wav')
        this.load.audio('music', '../game/assets/snd/backsound.wav')
        this.load.audio('gos', '../game/assets/snd/game-over.wav')
        this.load.audio('jump', '../game/assets/snd/jump.wav')
        this.load.audio('hit', '../game/assets/snd/collide.wav')
        this.load.audio('sheild', '../dungeon/assets/snd/DCsheild.mp3')
    }

    create() {

        k = this.input.keyboard.addKeys(keys)

        music = this.sound.add('music', { loop: true, volume: .2, })
        let pickup = this.sound.add('pickup')
        let gos = this.sound.add('gos')
        jump = this.sound.add('jump')
        let hit = this.sound.add('hit')
        let pusnd = this.sound.add('sheild')
        music.play()

        this.add.image(0, 0, 'bg').setOrigin(0, 0)
        pl = this.physics.add.sprite(100, 100, 'pl')
        pl.setCollideWorldBounds(true)
        pl.setGravityY(1200)

        let bad = this.physics.add.group()
        const spawnEnemy = () => {
            let badX = rX();
            let badY = rY();
            let plX1 = pl.centerX-100
            let plX2 = pl.centerX+100
            let plY1 = pl.centerY-100
            let plY2 = pl.centerY+100

            if ((badX > plX1 && badX < plX2) && (badY > plY1 && badY < plY2)) {
                spawnEnemy()
            } else {
                let b = bad.create(badX, badY, 'bad')
                b.setCollideWorldBounds(true)
                b.setScale(2)
                b.setBounce(1)
                b.setVelocity(200)
            }
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
            let a = 0
            while (a < b) {
                coins.create(rX(), rY(), 'coin')
                a++
            }
        }
        spawnCoins(8)

        let powerUps = this.physics.add.staticGroup()
        const spawnPowerUps = (b) => {
            let a = 0
            while (a < b) {
                if (1 == randint(10)) {
                    powerUps.create(rX(), rY(), 'powerup')
                }
                a++
            }
        }

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
            spawnPowerUps(1)
        }

        const hitBad = (pl, bad) => {
            if (poweredUp == false) {
                pl.setTint('#ff0000')
                music.stop()
                gos.play()
                this.add.image(0, 0, 'go').setOrigin(0, 0)
                go = true
                this.physics.pause()
                clearInterval(enemySpawnTimer)
            } else if (poweredUp == true) {
                bad.destroy()
            }
        }

        const collectPowerUps = (pl, powerUps) => {
            powerUps.destroy()
            if (poweredUp == false) {
                poweredUp = true
                pusnd.play()
                const indicator = this.add.image(0, 0, 'border').setOrigin(0, 0)

                setTimeout(() => {
                    poweredUp = false;
                    indicator.destroy();
                    if (queuedPower > 0) {
                        queuedPower--
                        collectPowerUps(pl, powerUps)
                    }
                }, 5000)
            } else if (poweredUp == true) {
                queuedPower++
            }
        }


        const setMoreCoinPoints = (pl, plats, moreCoinPoints) => {
            moreCoinPoints = 0;
        }

        this.physics.add.collider(pl, plats, setMoreCoinPoints)
        this.physics.add.overlap(pl, coins, collectCoin)
        this.physics.add.collider(bad, plats)
        this.physics.add.collider(pl, bad, hitBad)
        this.physics.add.overlap(pl, powerUps, collectPowerUps)

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
            score = 0
            poweredUp = false
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

