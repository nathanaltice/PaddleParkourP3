class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        // reset parameters
        this.barrierSpeed = -450;
        this.barrierSpeedMax = -1000;
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

        // add snapshot image from prior Scene
        let titleSnap = this.add.image(centerX, centerY, 'titlesnapshot').setOrigin(0.5);
        this.tweens.add({
            targets: titleSnap,
            duration: 4500,
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 0 },
            repeat: 0
        });

        // 🎉 let's get the PARTYcles started 🎉
        // create line on right side of screen for particles source
        let line = new Phaser.Geom.Line(w, 0, w, h);  
        // create particle manager  
        this.particleManager = this.add.particles('cross');
        // add emitter and setup properties
        this.lineEmitter = this.particleManager.createEmitter({
            gravityX: -200,
            lifespan: 5000,
            alpha: { start: 0.5, end: 0.1 },
            tint: [ 0xffff00, 0xff0000, 0x00ff00, 0x00ffff, 0x0000ff ],
            emitZone: { type: 'random', source: line, quantity: 150 },
            blendMode: 'ADD'
        });

        // set up player paddle (physics sprite) and set properties
        paddle = this.physics.add.sprite(32, centerY, 'paddle').setOrigin(0.5);
        paddle.setCollideWorldBounds(true);
        paddle.setBounce(0.5);
        paddle.setImmovable();
        paddle.setMaxVelocity(0, 600);
        paddle.setDragY(200);
        paddle.setDepth(1);             // ensures that paddle z-depth remains above shadow paddles
        paddle.destroyed = false;       // custom property to track paddle life
        paddle.setBlendMode('SCREEN');  // set a WebGL blend mode

        // set up barrier group
        this.barrierGroup = this.add.group({
            runChildUpdate: true    // make sure update runs on group children
        });
        // wait a few seconds before spawning barriers
        this.time.delayedCall(2500, () => { 
            this.addBarrier(); 
        });

        // set up difficulty timer (triggers callback every second)
        this.difficultyTimer = this.time.addEvent({
            delay: 1000,
            callback: this.levelBump,
            callbackScope: this,
            loop: true
        });

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    // create new barriers and add them to existing barrier group
    addBarrier() {
        let speedVariance =  Phaser.Math.Between(0, 50);
        let barrier = new Barrier(this, this.barrierSpeed - speedVariance);
        this.barrierGroup.add(barrier);
    }

    update() {
        // make sure paddle is still alive
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
        // increment level (ie, score)
        level++;

        // bump speed every 5 levels (until max is hit)
        if(level % 5 == 0) {
            //console.log(`level: ${level}, speed: ${this.barrierSpeed}`);
            this.sound.play('clang', { volume: 0.75 });         // play clang to signal speed up
            if(this.barrierSpeed >= this.barrierSpeedMax) {     // increase barrier speed
                this.barrierSpeed -= 25;
                this.bgm.rate += 0.01;                          // increase bgm playback rate (ドキドキ)
            }
            
            // make flying score text (using three stacked)
            let lvltxt01 = this.add.bitmapText(w, centerY, 'gem', `<${level}>`, 96).setOrigin(0, 0.5);
            let lvltxt02 = this.add.bitmapText(w, centerY, 'gem', `<${level}>`, 96).setOrigin(0, 0.5);
            let lvltxt03 = this.add.bitmapText(w, centerY, 'gem', `<${level}>`, 96).setOrigin(0, 0.5);
            lvltxt01.setBlendMode('ADD').setTint(0xff00ff);
            lvltxt02.setBlendMode('SCREEN').setTint(0x0000ff);
            lvltxt03.setBlendMode('ADD').setTint(0xffff00);
            this.tweens.add({
                targets: [lvltxt01, lvltxt02, lvltxt03],
                duration: 2500,
                x: { from: w, to: 0 },
                alpha: { from: 0.9, to: 0 },
                onComplete: function() {
                    lvltxt01.destroy();
                    lvltxt02.destroy();
                    lvltxt03.destroy();
                }
            });
            this.tweens.add({
                targets: lvltxt02,
                duration: 2500,
                y: '-=20'       // slowly nudge y-coordinate up
            });
            this.tweens.add({
                targets: lvltxt03,
                duration: 2500,
                y: '+=20'       // slowly nudge y-coordinate down
            });
 
            // change game border color
            let rndColor = this.getRandomColor();
            document.getElementsByTagName('canvas')[0].style.borderColor = rndColor;

            // cam shake: .shake( [duration] [, intensity] )
            this.cameras.main.shake(100, 0.01);
        }

        // set HARD mode
        if(level == 45) {
            paddle.scaleY = 0.75;       // 3/4 paddle size
        }
        // set EXTREME mode
        if(level == 75) {
            paddle.scaleY = 0.5;        // 1/2 paddle size
            this.extremeMODE = true;    // 🌈
        }
    }

    // random HTML hex color generator from:
    // https://stackoverflow.com/questions/1484506/random-color-generator
    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    spawnShadowPaddles() {
        // add a "shadow paddle" at main paddle position
        let shadowPaddle = this.add.image(paddle.x, paddle.y, 'paddle').setOrigin(0.5);
        shadowPaddle.scaleY = paddle.scaleY;            // scale to parent paddle
        shadowPaddle.tint = Math.random() * 0xFFFFFF;   // tint w/ rainbow colors
        shadowPaddle.alpha = 0.5;                       // make semi-transparent
        // tween shadow paddle alpha to 0
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
        this.sound.play('death', { volume: 0.25 }); // play death sound
        this.cameras.main.shake(2500, 0.0075);      // camera death shake
        
        // add tween to fade out audio
        this.tweens.add({
            targets: this.bgm,
            volume: 0,
            ease: 'Linear',
            duration: 2000,
        });

        // create particle explosion
        let deathParticleManager = this.add.particles('cross');
        let deathEmitter = deathParticleManager.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: { min: -150, max: 150 },
            lifespan: 4000,
            blendMode: 'ADD'
        });
        // store current paddle bounds so we can create a paddle-shaped death emitter
        let pBounds = paddle.getBounds();
        deathEmitter.setEmitZone({
            source: new Phaser.Geom.Rectangle(pBounds.x, pBounds.y, pBounds.width, pBounds.height),
            type: 'edge',
            quantity: 1000
        });
        // make it boom 💥
        deathEmitter.explode(1000);
        
        // create two gravity wells: one offset from paddle and one at center screen
        deathParticleManager.createGravityWell({
            x: pBounds.centerX + 200,
            y: pBounds.centerY,
            power: 0.5,
            epsilon: 100,
            gravity: 100
        });
        deathParticleManager.createGravityWell({
            x: centerX,
            y: centerY,
            power: 2,
            epsilon: 100,
            gravity: 150
        });
       
        // kill paddle
        paddle.destroy();    

        // switch states after timer expires
        this.time.delayedCall(4000, () => { this.scene.start('gameOverScene'); });
    }
}