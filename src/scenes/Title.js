class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        // add title screen text
        let title = this.add.bitmapText(centerX, centerY, 'gem', 'PADDLE PARKOUR P3', 48).setOrigin(0.5);
        title.tint = 0xFACADE;
        this.add.bitmapText(centerX, centerY + textSpacer, 'gem', 'Use the UP + DOWN ARROWS to dodge color paddles and avoid getting REKT', 24).setOrigin(0.5);
        this.add.bitmapText(centerX, centerY + textSpacer*2, 'gem', 'Press UP ARROW to Start', 24).setOrigin(0.5);

        // text tweens
        this.tweens.add({
            targets: title,
            duration: 1500,
            angle: { from: -0.75, to: 0.75 },
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