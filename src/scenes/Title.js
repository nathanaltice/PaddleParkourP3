class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        // add title screen text
        this.add.text(centerX, centerY, 'PADDLE PARKOUR P3', { fontFamily: 'Helvetica', fontSize: '48px', color: '#FACADE' }).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Use the UP + DOWN ARROWS to dodge color paddles and avoid getting REKT', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*2, 'Press UP ARROW to Start', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);

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