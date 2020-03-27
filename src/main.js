// Nathan Altice
// Paddle Parkour PIII
// An endless dodging game (ported from Phaser CE)
// Updated 3/27/20

'use strict';

// define and configure main Phaser game object
let config = {
    type: Phaser.AUTO,
    height: 640,
    width: 960,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Load, Title, Play, GameOver ]
}

let game = new Phaser.Game(config);

// define globals
let centerX = game.config.width/2;
let centerY = game.config.height/2;
const textSpacer = 64;
let paddle = null;
let paddleVelocity = 150;
const colors = [0x1BE7ff, 0x6EEB83, 0xE4FF1A, 0xE8AA14]; // colors array (rainbows!)
let colorIndex = 0;
let highScore;
let newHighScore;
let cursors;