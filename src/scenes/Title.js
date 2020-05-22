class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        // add title screen text
        let title01 = this.add.bitmapText(centerX, centerY, 'gem', 'PADDLE PARKOUR P3', 64).setOrigin(0.5).setTint(0xff0000);
        let title02 = this.add.bitmapText(centerX, centerY, 'gem', 'PADDLE PARKOUR P3', 64).setOrigin(0.5).setTint(0xff00ff).setBlendMode('SCREEN');
        let title03 = this.add.bitmapText(centerX, centerY, 'gem', 'PADDLE PARKOUR P3', 64).setOrigin(0.5).setTint(0xffff00).setBlendMode('ADD');
       
        this.add.bitmapText(centerX, centerY + textSpacer, 'gem', 'Use the UP & DOWN ARROWS to dodge color paddles', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*2, 'gem', 'Press UP ARROW to Start', 36).setOrigin(0.5);
        this.add.bitmapText(centerX, h - textSpacer, 'gem', 'Nathan Altice 2020', 16).setOrigin(0.5);

        // title text tween
        this.tweens.add({
            targets: title01,
            duration: 2500,
            angle: { from: -1, to: 1 },
            yoyo: true,
            repeat: -1,
            onYoyo: function() {
                this.cameras.main.shake(100, 0.0025);
            },
            onYoyoScope: this
        });
        this.tweens.add({
            targets: title02,
            duration: 2500,
            angle: { from: 1, to: -1 },
            yoyo: true,
            repeat: -1
        });

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // check for UP input
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('playScene');
        }
    }
}