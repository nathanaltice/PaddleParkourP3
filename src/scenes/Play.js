class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        // reset parameters
        this.barrierSpeed = -450;
        this.level = 0;
        this.extremeMODE = false;
        this.shadowLock = false;

        // set up audio, play bgm

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();

        // set up paddle (physics sprite)
        paddle = this.physics.add.sprite(32, centerY, 'paddle').setOrigin(0.5);
        paddle.setCollideWorldBounds(true);
        paddle.setBounce(0.5);
        paddle.setImmovable();
        paddle.setMaxVelocity(0, 600);
        paddle.setDragY(200);
        paddle.setDepth(1);         // ensures that paddle z-depth remains above shadow paddles
        paddle.destroyed = false;   // custom property to track paddle life

        // set up barrier group


        // set up difficulty timer
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.speedBump,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // check for player input
        if(cursors.up.isDown) {
            paddle.body.velocity.y -= paddleVelocity;
        } else if(cursors.down.isDown) {
            paddle.body.velocity.y += paddleVelocity;
        }

        // check for collision
        if(!paddle.destroyed) {

        }

        // spawn rainbow trail if in EXTREME mode
        if(this.extremeMODE && !this.shadowLock && !paddle.destroyed) {
            this.spawnShadowPaddles();
            this.shadowLock = true;
            // lock shadow paddle spawning to a given time interval
            this.time.delayedCall(15, () => { this.shadowLock = false; })
        }
    }

    speedBump() {
        // raise barrier speed, increment level
        this.barrierSpeed -= 10;
        this.level++; console.log(`level: ${ this.level }`);

        // set HARD mode
        if(this.level == 30) {
            paddle.scaleY = 0.75;
        }
        // set EXTREME mode
        if(this.level == 60) {
            paddle.scaleY = 0.5;
            this.extremeMODE = true;
        }
    }

    spawnShadowPaddles() {
        // add a "shadow paddle" at main paddle position
        let shadowPaddle = this.add.image(paddle.x, paddle.y, 'paddle').setOrigin(0.5);
        shadowPaddle.scaleY = paddle.scaleY;            // scale to parent paddle
        shadowPaddle.tint = Math.random() * 0xFFFFFF;   // tint w/ rainbow colors
        shadowPaddle.alpha = 0.5;                       // make semi-transparent
        // tween alpha to 0
        this.tweens.add({ 
            targets: shadowPaddle, 
            alpha: { from: 0.5, to: 0 }, 
            duration: 750,
            ease: 'Linear',
            repeat: 0 
        });
        // set a kill timer for trail effect
        this.time.delayedCall(750, () => { shadowPaddle.destroy(); } );
    }
}