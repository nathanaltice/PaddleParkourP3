class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        // reset parameters
        this.barrierSpeed = -450;
        this.barrierSpeedMax = -950;
        level = 0;
        this.extremeMODE = false;
        this.shadowLock = false;

        // set up audio, play bgm
        this.bgm = this.sound.add('beats', { 
            mute: false,
            volume: 1,
            rate: 1,
            loop: true 
        });
        this.bgm.play();

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

        // set up barrier group and add first barrier to kick things off
        this.barrierGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        this.addBarrier();

        // set up difficulty timer (triggers callback every second)
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        // debug
        
    }

    addBarrier() {
        let barrier = new Barrier(this, this.barrierSpeed);     // create new barrier
        this.barrierGroup.add(barrier);                         // add it to existing group
    }

    update() {
        if(!paddle.destroyed) {
            // check for player input
            if(cursors.up.isDown) {
                paddle.body.velocity.y -= paddleVelocity;
            } else if(cursors.down.isDown) {
                paddle.body.velocity.y += paddleVelocity;
            }
            // check for collisions
            this.physics.world.collide(paddle, this.barrierGroup, this.paddleCollision, null, this);
        }

        // spawn rainbow trail if in EXTREME mode
        if(this.extremeMODE && !this.shadowLock && !paddle.destroyed) {
            this.spawnShadowPaddles();
            this.shadowLock = true;
            // lock shadow paddle spawning to a given time interval
            this.time.delayedCall(15, () => { this.shadowLock = false; })
        }
    }

    levelBump() {
        // increment level (aka score)
        level++;

        // bump speed every 5 levels
        if(level % 5 == 0) {
            console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
            this.sound.play('clang', { volume: 0.75 });         // play clang to signal speed up
            if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
                this.barrierSpeed -= 25;
                this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
            }
        }
        // set HARD mode
        if(level == 45) {
            paddle.scaleY = 0.75;
        }
        // set EXTREME mode
        if(level == 75) {
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

    paddleCollision() {
        paddle.destroyed = true;                    // turn off collision checking
        this.difficultyTimer.destroy();             // shut down timer
        this.sound.play('death', { volume: 0.5 });  // play death sound
        // create tween to fade out audio
        this.tweens.add({
            onStart: () => console.log('fading volume...'),
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
            onComplete: () => console.log('fade done')
        });

        // create particle explosion
        let deathParticles = this.add.particles('fragment');
        let deathEmitter = deathParticles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speedX: { min: -50, max: 500 },
            speedY: { min: -500, max: 500 },
            lifespan: 1500
        });
        // make it boom 💥
        deathEmitter.explode(150, paddle.x, paddle.y);
        // kill paddle
        paddle.destroy();              
        // switch states after timer expires
        this.time.delayedCall(3000, () => { this.scene.start('gameOverScene'); });
    }
}