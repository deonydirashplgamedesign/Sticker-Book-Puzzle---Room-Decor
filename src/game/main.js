import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 1080,
    height: 1920,
    parent: 'game-container',
    transparent: true,
    scale: {
        mode: Scale.NONE,
        width: 1080,
        height: 1920
    },
    render: {
        antialias: true,
        pixelArt: false
    },
    scene: [
        MainGame
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
