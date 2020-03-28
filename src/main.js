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
var centerX = game.config.width/2;
var centerY = game.config.height/2;
const textSpacer = 64;
var paddle = null;
const paddleWidth = 16;
const paddleHeight = 128;
const paddleVelocity = 150;
var highScore;
var newHighScore;
var cursors;