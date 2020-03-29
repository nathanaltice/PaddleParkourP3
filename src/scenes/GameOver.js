class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        // check for high score in local storage
        // uncomment console.log statements if you need to debug local storage
        if(localStorage.getItem('hiscore') != null) {
            let storedScore = parseInt(localStorage.getItem('hiscore'));
            //console.log(`storedScore: ${storedScore}`);
            // see if current score is higher than stored score
            if(level > storedScore) {
                //console.log(`New high score: ${level}`);
                localStorage.setItem('hiscore', level.toString());
                highScore = level;
                newHighScore = true;
            } else {
                //console.log('No new high score :/');
                highScore = parseInt(localStorage.getItem('hiscore'));
                newHighScore = false;
            }
        } else {
            //console.log('No high score stored. Creating new.');
            highScore = level;
            localStorage.setItem('hiscore', highScore.toString());
            newHighScore = true;
        }

        // add GAME OVER text
        if(newHighScore) {
            this.add.text(centerX, centerY - textSpacer, 'New Hi-Score!', { fontFamily: 'Helvetica', fontSize: '32px', color: '#FACADE' }).setOrigin(0.5);
        }
        this.add.text(centerX, centerY, `You avoided getting REKT for ${level}s`, { fontFamily: 'Helvetica', fontSize: '48px', color: '#FFF' }).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, `This browser's best: ${highScore}s`, { fontFamily: 'Helvetica', fontSize: '32px', color: '#FACADE' }).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer*2, `Press UP ARROW to Restart`, { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);

        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // wait for UP input to restart game
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.scene.start('playScene');
        }
    }
}