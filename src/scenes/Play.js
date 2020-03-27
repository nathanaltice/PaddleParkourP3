class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {

    }

    create() {
        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            console.log('key up');
        }
    }
}